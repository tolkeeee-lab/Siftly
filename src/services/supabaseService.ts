import { ProductData } from '../types/product';
import { getSupabaseClient } from '../lib/supabaseClient';
import { parseNum } from '../utils/formatters';

function isValidUuid(str?: string): boolean {
  return !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function mapProductToDb(p: ProductData, userId?: string): Record<string, any> {
  const validProductId = isValidUuid(p.id)
    ? p.id
    : typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

  const row: Record<string, any> = {
    id: validProductId,
    seq: p.seq,
    produit: p.produit || '',
    category: p.category || 'Maison & Confort',
    img_src: p.imgSrc || '',
    creative: p.creative || '',
    alibaba: p.alibaba || '',
    siteweb: p.siteweb || '',
    marche: p.marche || '',
    concurrent: parseNum(p.concurrent),
    sourcing: parseNum(p.sourcing),
    poids: parseNum(p.poids),
    modeimport: p.modeimport || 'bateau',
    tarifbateau: parseNum(p.tarifbateau),
    tarifavion: parseNum(p.tarifavion),
    cac: parseNum(p.cac),
    livraison: parseNum(p.livraison),
    vente: parseNum(p.vente),
    douleur: p.douleur === '' ? null : parseNum(p.douleur),
    nonres: p.nonres === '' ? null : parseNum(p.nonres),
    etendue: p.etendue === '' ? null : parseNum(p.etendue),
    impact: p.impact === '' ? null : parseNum(p.impact),
    waouh: p.waouh === '' ? null : parseNum(p.waouh),
    innovant: p.innovant === '' ? null : parseNum(p.innovant),
    nonsaison: p.nonsaison === '' ? null : parseNum(p.nonsaison),
    habitudes: p.habitudes === '' ? null : parseNum(p.habitudes),
    poidsfacteur: p.poidsfacteur === '' ? null : parseNum(p.poidsfacteur),
    cible: p.cible || '',
    angle: p.angle || '',
    market_analysis: p.marketAnalysis || p.isFavorite !== undefined 
      ? JSON.stringify({ ...(p.marketAnalysis || {}), _isFavorite: p.isFavorite }) 
      : null,
    updated_at: new Date().toISOString(),
  };

  const isUuid = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (isUuid) {
    row.user_id = userId;
  }

  return row;
}

export function mapDbToProduct(row: Record<string, any>): ProductData {
  let marketAnalysis = undefined;
  let isFavorite = false;

  if (row.market_analysis) {
    try {
      const parsed = typeof row.market_analysis === 'string' ? JSON.parse(row.market_analysis) : row.market_analysis;
      if (parsed._isFavorite !== undefined) {
        isFavorite = parsed._isFavorite;
        delete parsed._isFavorite;
      }
      if (Object.keys(parsed).length > 0) {
        marketAnalysis = parsed;
      }
    } catch { /* ignore */ }
  }

  return {
    id: row.id,
    seq: row.seq || 1,
    produit: row.produit || '',
    category: row.category || 'Maison & Confort',
    imgSrc: row.img_src || '',
    creative: row.creative || '',
    alibaba: row.alibaba || '',
    siteweb: row.siteweb || '',
    marche: row.marche || '',
    concurrent: row.concurrent ?? '',
    sourcing: row.sourcing ?? '',
    poids: row.poids ?? '',
    modeimport: row.modeimport || 'bateau',
    tarifbateau: row.tarifbateau ?? 3500,
    tarifavion: row.tarifavion ?? 9000,
    cac: row.cac ?? '',
    livraison: row.livraison ?? '',
    vente: row.vente ?? '',
    douleur: row.douleur ?? '',
    nonres: row.nonres ?? '',
    etendue: row.etendue ?? '',
    impact: row.impact ?? '',
    waouh: row.waouh ?? '',
    innovant: row.innovant ?? '',
    nonsaison: row.nonsaison ?? '',
    habitudes: row.habitudes ?? '',
    poidsfacteur: row.poidsfacteur ?? '',
    cible: row.cible || '',
    angle: row.angle || '',
    isFavorite,
    marketAnalysis,
  };
}

async function getActiveUserId(): Promise<string | undefined> {
  const client = getSupabaseClient();
  if (!client) return undefined;
  try {
    const { data: { session } } = await client.auth.getSession();
    if (session?.user?.id) return session.user.id;
    const { data: { user } } = await client.auth.getUser();
    return user?.id;
  } catch (e) {
    console.warn('Error getting active user ID', e);
    return undefined;
  }
}

export async function fetchProductsFromSupabase(targetUserId?: string): Promise<ProductData[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const activeId = targetUserId || (await getActiveUserId());
  
  let query = client.from('products').select('*');
  if (activeId) {
    query = query.eq('user_id', activeId);
  } else {
    // If not authenticated, return null so we don't leak other accounts' products
    return null;
  }
  
  const { data, error } = await query.order('seq', { ascending: true });
  if (error) {
    console.warn('Error fetching products from Supabase:', error);
    return null;
  }
  return (data || []).map(mapDbToProduct);
}

export async function saveProductToSupabase(product: ProductData, targetUserId?: string): Promise<boolean> {
  const userId = targetUserId || (await getActiveUserId());
  const row = mapProductToDb(product, userId);
  
  try {
    const res = await fetch('/api/workspace/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: [row] }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('API failed to save product:', errBody);
      alert('Erreur lors de la sauvegarde du produit dans Supabase: ' + JSON.stringify(errBody));
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Error upserting product to Supabase via API:', err);
    alert('Erreur de connexion API Supabase (sauvegarde produit): ' + err.message);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/workspace/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('API failed to delete product from Supabase:', errBody);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Error deleting product from Supabase via API:', err);
    return false;
  }
}

export async function saveAllProductsToSupabase(products: ProductData[], targetUserId?: string): Promise<boolean> {
  if (products.length === 0) return false;
  const userId = targetUserId || (await getActiveUserId());
  const rows = products.map((p) => mapProductToDb(p, userId));
  
  try {
    const res = await fetch('/api/workspace/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: rows }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('API failed to save all products:', errBody);
      alert('Erreur lors de la sauvegarde des produits (Synchro Cloud): ' + JSON.stringify(errBody));
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Error saving products to Supabase via API:', err);
    alert('Erreur de connexion API Supabase (Synchro Cloud): ' + err.message);
    return false;
  }
}
