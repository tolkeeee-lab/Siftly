'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ProductData } from '../types/product';
import { checkLocalStorageUsage, StorageUsageInfo } from '../utils/storageCheck';
import { compressImage } from '../utils/imageCompressor';
import {
  resolveWorkspaceContext,
  syncWorkspaceProducts,
  persistProductChange,
  persistProductDeletion,
  WorkspaceContext,
} from '../services/syncEngine';
import { useAuth } from './useAuth';

export function useProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [workspaceCtx, setWorkspaceCtx] = useState<WorkspaceContext>({
    workspaceOwnerId: 'guest',
    role: 'admin',
    isCollaborator: false,
  });

  const workspaceCtxRef = useRef<WorkspaceContext>(workspaceCtx);
  useEffect(() => {
    workspaceCtxRef.current = workspaceCtx;
  }, [workspaceCtx]);

  const { user } = useAuth();
  const [storageInfo, setStorageInfo] = useState<StorageUsageInfo>({
    usedBytes: 0,
    quotaBytes: 5 * 1024 * 1024,
    percent: 0,
    isNearFull: false,
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateStorageMetrics = useCallback(() => {
    setStorageInfo(checkLocalStorageUsage('siftly_products_ws_' + workspaceCtxRef.current.workspaceOwnerId));
  }, []);

  const loadFromSupabase = useCallback(async (forceUpload: boolean = false) => {
    setIsSyncing(true);
    try {
      const ctx = await resolveWorkspaceContext(user?.email ?? undefined, user?.id ?? undefined);
      setWorkspaceCtx(ctx);
      workspaceCtxRef.current = ctx;

      const { products: syncedList } = await syncWorkspaceProducts(ctx, forceUpload);
      setProducts(syncedList);
    } catch (err) {
      console.warn('SyncEngine load error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  useEffect(() => {
    loadFromSupabase();
  }, [loadFromSupabase]);

  useEffect(() => {
    updateStorageMetrics();
  }, [products, updateStorageMetrics]);

  const saveToStorage = useCallback((data: ProductData[], updatedProduct?: ProductData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        setShowAutoSaveToast(true);
        setTimeout(() => setShowAutoSaveToast(false), 1500);

        setIsSyncing(true);
        await persistProductChange(workspaceCtxRef.current, data, updatedProduct);
        updateStorageMetrics();
      } catch (err) {
        console.warn('SyncEngine persist error:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 300);
  }, [updateStorageMetrics]);

  const updateProduct = useCallback((id: string, field: keyof ProductData, value: any) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, [field]: value } : p));
      const target = next.find((p) => p.id === id);
      saveToStorage(next, target);
      return next;
    });
  }, [saveToStorage]);

  const generateValidUuid = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const addProduct = useCallback((initialData?: Partial<ProductData>): ProductData => {
    let createdProduct: ProductData | null = null;
    setProducts((prev) => {
      const maxSeq = prev.reduce((max, p) => Math.max(max, p.seq || 0), 0);
      const newProduct: ProductData = {
        id: generateValidUuid(),
        seq: maxSeq + 1,
        produit: initialData?.produit || '',
        category: initialData?.category || 'Maison & Confort',
        imgSrc: initialData?.imgSrc || '',
        creative: initialData?.creative || '',
        alibaba: initialData?.alibaba || '',
        siteweb: initialData?.siteweb || '',
        marche: initialData?.marche || '',
        concurrent: initialData?.concurrent ?? '',
        sourcing: initialData?.sourcing ?? '',
        poids: initialData?.poids ?? '',
        modeimport: initialData?.modeimport || 'bateau',
        tarifbateau: initialData?.tarifbateau ?? 3500,
        tarifavion: initialData?.tarifavion ?? 9000,
        cac: initialData?.cac ?? '',
        livraison: initialData?.livraison ?? '',
        vente: initialData?.vente ?? '',
        douleur: initialData?.douleur ?? '',
        nonres: initialData?.nonres ?? '',
        etendue: initialData?.etendue ?? '',
        impact: initialData?.impact ?? '',
        waouh: initialData?.waouh ?? '',
        innovant: initialData?.innovant ?? '',
        nonsaison: initialData?.nonsaison ?? '',
        habitudes: initialData?.habitudes ?? '',
        poidsfacteur: initialData?.poidsfacteur ?? '',
        cible: initialData?.cible || '',
        angle: initialData?.angle || '',
      };
      createdProduct = newProduct;
      const next = [...prev, newProduct];
      saveToStorage(next, newProduct);
      return next;
    });
    return createdProduct!;
  }, [saveToStorage]);

  const duplicateProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const targetIndex = prev.findIndex((p) => p.id === id);
      if (targetIndex === -1) return prev;
      const target = prev[targetIndex];
      const maxSeq = prev.reduce((max, p) => Math.max(max, p.seq || 0), 0);
      const cloned: ProductData = {
        ...target,
        id: generateValidUuid(),
        seq: maxSeq + 1,
        produit: target.produit ? `${target.produit} (copie)` : 'Copie produit',
      };
      const next = [...prev];
      next.splice(targetIndex + 1, 0, cloned);
      saveToStorage(next, cloned);
      return next;
    });
  }, [saveToStorage]);

  const addMultipleProducts = useCallback((rows: Partial<ProductData>[]) => {
    rows.forEach((r) => addProduct(r));
  }, [addProduct]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistProductDeletion(workspaceCtx, next, id);
      return next;
    });
  }, [workspaceCtx]);

  const replaceAllProducts = useCallback(async (data: ProductData[]) => {
    // Compress base64 images if too large
    const processedData = await Promise.all(
      data.map(async (p) => {
        if (p.imgSrc && p.imgSrc.startsWith('data:image/') && p.imgSrc.length > 100000) {
          try {
            const compressed = await compressImage(p.imgSrc, 400, 0.65);
            return { ...p, imgSrc: compressed };
          } catch {
            return p;
          }
        }
        return p;
      })
    );

    // Ensure every product has a valid non-null UUID (guards against external JSON with missing ids)
    const sanitized = processedData.map((p, idx) => ({
      ...p,
      id: p.id && typeof p.id === 'string' && p.id.trim() !== ''
        ? p.id
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }),
      seq: p.seq ?? idx + 1,
    }));

    setProducts(sanitized);
    setIsSyncing(true);
    await persistProductChange(workspaceCtx, sanitized);
    setIsSyncing(false);
  }, [workspaceCtx]);

  return {
    products,
    updateProduct,
    addProduct,
    duplicateProduct,
    addMultipleProducts,
    deleteProduct,
    replaceAllProducts,
    showAutoSaveToast,
    storageInfo,
    isSyncing,
    loadFromSupabase,
  };
}
