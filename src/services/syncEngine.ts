/**
 * Single Unified Synchronization & Workspace Engine for Siftly EAA
 * -----------------------------------------------------------------
 * Handles 100% of data persistence, multi-user isolation, multi-device cloud sync,
 * and offline-first fallback without duplicate or conflicting hook logic.
 */

import { ProductData } from '../types/product';
import { UserRole } from '../types/teamRoles';
import { INITIAL_PRODUCTS } from '../constants/defaultData';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  saveAllProductsToSupabase,
  deleteProductFromSupabase,
  mapDbToProduct,
} from './supabaseService';

/**
 * Safely saves to localStorage and alerts the user if the quota is exceeded.
 */
function safeLocalStorageSet(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    console.error('LocalStorage Save Error:', e);
    if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
      alert("⚠️ Espace de stockage local saturé ! Les images de vos produits sont trop lourdes. Veuillez utiliser des images plus petites ou nettoyer votre cache, sinon vos modifications hors-ligne risquent de ne pas être sauvegardées.");
    }
  }
}

export interface WorkspaceContext {
  workspaceOwnerId: string; // Active Owner ID (either user's own ID or linked founder's ID)
  role: UserRole;
  isCollaborator: boolean;
  memberName?: string;
  userEmail?: string;
}

const STORAGE_PREFIX = 'siftly_products_ws_';

function getStorageKey(ownerId: string): string {
  return `${STORAGE_PREFIX}${ownerId || 'guest'}`;
}

/**
 * 1. Resolve Active Workspace Context for the logged-in user
 */
export async function resolveWorkspaceContext(userEmail?: string, userId?: string): Promise<WorkspaceContext> {
  if (!userEmail) {
    return {
      workspaceOwnerId: userId || 'guest',
      role: 'admin',
      isCollaborator: false,
    };
  }

  try {
    const cleanEmail = userEmail.toLowerCase().trim();
    const res = await fetch(`/api/workspace?email=${encodeURIComponent(cleanEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.isCollaborator && data.ownerId) {
        return {
          workspaceOwnerId: data.ownerId,
          role: (data.role || 'assistant') as UserRole,
          isCollaborator: true,
          memberName: data.memberName,
          userEmail: cleanEmail,
        };
      }
    }
  } catch (err) {
    console.warn('SyncEngine: Workspace lookup API notice:', err);
  }

  // Founder / Owner of own workspace
  return {
    workspaceOwnerId: userId || 'owner-main',
    role: 'admin',
    isCollaborator: false,
    userEmail: userEmail.toLowerCase().trim(),
  };
}

/**
 * 2. Fetch Products with Resilient Cloud + Local Storage Merge
 */
export async function syncWorkspaceProducts(
  ctx: WorkspaceContext,
  forceUpload: boolean = false
): Promise<{ products: ProductData[]; isCloudSynced: boolean }> {
  const cacheKey = getStorageKey(ctx.workspaceOwnerId);

  // Read local cache
  let localProducts: ProductData[] = [];
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localProducts = parsed;
        }
      }
    } catch { /* ignore */ }
  }

  // Force upload if requested
  if (forceUpload && localProducts.length > 0) {
    await saveAllProductsToSupabase(localProducts, ctx.workspaceOwnerId);
  }

  // Fetch Cloud Products via Server API (bypasses RLS) or direct Supabase client
  let cloudProducts: ProductData[] | null = null;
  try {
    const res = await fetch(`/api/workspace/products?ownerId=${encodeURIComponent(ctx.workspaceOwnerId)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        cloudProducts = data.products.map(mapDbToProduct);
      }
    }
  } catch (err) {
    console.warn('SyncEngine: Server workspace products fetch notice:', err);
  }

  if (!cloudProducts) {
    cloudProducts = await fetchProductsFromSupabase(ctx.workspaceOwnerId);
  }

  // UNION MERGE: Combine Cloud and Local products by ID so no newly added product is ever lost!
  const mergedMap = new Map<string, ProductData>();

  // 1. Add Cloud products
  if (cloudProducts && cloudProducts.length > 0) {
    cloudProducts.forEach((p) => mergedMap.set(p.id, p));
  }

  // 2. Preserve Local products (adds newly created local items that Cloud hasn't received yet)
  localProducts.forEach((p) => {
    if (p.id && !mergedMap.has(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  const finalProducts = Array.from(mergedMap.values());

  if (finalProducts.length > 0) {
    // If local had new products missing from Cloud, auto-sync the merged list to Supabase
    if (ctx.workspaceOwnerId !== 'guest' && finalProducts.length > (cloudProducts?.length || 0)) {
      saveAllProductsToSupabase(finalProducts, ctx.workspaceOwnerId);
    }

    if (typeof window !== 'undefined') {
      safeLocalStorageSet(cacheKey, JSON.stringify(finalProducts));
    }
    return { products: finalProducts, isCloudSynced: true };
  } else if (!ctx.isCollaborator) {
    // Both Cloud & Local are empty for an Owner: seed default initial products & push to cloud
    if (typeof window !== 'undefined') {
      safeLocalStorageSet(cacheKey, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (ctx.workspaceOwnerId !== 'guest') {
      await saveAllProductsToSupabase(INITIAL_PRODUCTS, ctx.workspaceOwnerId);
    }
    return { products: INITIAL_PRODUCTS, isCloudSynced: true };
  }

  // Collaborator with 0 products on cloud yet
  return { products: [], isCloudSynced: false };
}

/**
 * 3. Persist Single Product Change to Local Storage + Cloud
 */
export async function persistProductChange(
  ctx: WorkspaceContext,
  allProducts: ProductData[],
  updatedProduct?: ProductData
): Promise<boolean> {
  const targetId = (ctx && ctx.workspaceOwnerId && ctx.workspaceOwnerId !== 'guest')
    ? ctx.workspaceOwnerId
    : undefined;

  const cacheKey = getStorageKey(targetId || 'guest');

  if (typeof window !== 'undefined') {
    safeLocalStorageSet(cacheKey, JSON.stringify(allProducts));
    safeLocalStorageSet('eaa-produits-benin', JSON.stringify(allProducts));
  }

  // 2. Persist to Supabase Cloud
  if (updatedProduct) {
    return await saveProductToSupabase(updatedProduct, targetId);
  } else {
    return await saveAllProductsToSupabase(allProducts, targetId);
  }
}

/**
 * 4. Persist Product Deletion
 */
export async function persistProductDeletion(
  ctx: WorkspaceContext,
  allProducts: ProductData[],
  deletedId: string
): Promise<boolean> {
  const targetId = (ctx && ctx.workspaceOwnerId && ctx.workspaceOwnerId !== 'guest')
    ? ctx.workspaceOwnerId
    : undefined;

  const cacheKey = getStorageKey(targetId || 'guest');

  if (typeof window !== 'undefined') {
    safeLocalStorageSet(cacheKey, JSON.stringify(allProducts));
    safeLocalStorageSet('eaa-produits-benin', JSON.stringify(allProducts));
  }

  return await deleteProductFromSupabase(deletedId);
}
