'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ProductData } from '../types/product';
import { INITIAL_PRODUCTS } from '../constants/defaultData';
import { checkLocalStorageUsage, StorageUsageInfo } from '../utils/storageCheck';
import { compressImage } from '../utils/imageCompressor';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  saveAllProductsToSupabase,
} from '../services/supabaseService';
import { getStoredSupabaseConfig } from '../lib/supabaseClient';

const STORAGE_KEY = 'eaa-produits-benin';

export function useProducts() {
  const [products, setProducts] = useState<ProductData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.warn('Could not read saved products from localStorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageUsageInfo>({
    usedBytes: 0,
    quotaBytes: 5 * 1024 * 1024,
    percent: 0,
    isNearFull: false,
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateStorageMetrics = useCallback(() => {
    setStorageInfo(checkLocalStorageUsage(STORAGE_KEY));
  }, []);

  const loadFromSupabase = useCallback(async () => {
    if (!getStoredSupabaseConfig()) return;
    setIsSyncing(true);
    const dbProducts = await fetchProductsFromSupabase();
    if (dbProducts !== null && dbProducts.length > 0) {
      setProducts(dbProducts);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbProducts));
        } catch (e) {
          console.warn('LocalStorage quota warning during Supabase load', e);
        }
      }
    } else {
      // If Supabase has 0 products for user but local PC storage has products, upload them to Supabase cloud!
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Ensure every product has a valid non-null UUID before uploading
              const sanitized = parsed.map((p: any, idx: number) => ({
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
              // Persist sanitized products back to localStorage so future loads are also clean
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized)); } catch { /* quota */ }
              await saveAllProductsToSupabase(sanitized);
              setProducts(sanitized);
            }
          } catch (e) {
            console.warn('Could not sync local products to Supabase cloud', e);
          }
        }
      }
    }
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    loadFromSupabase();
  }, [loadFromSupabase]);

  useEffect(() => {
    updateStorageMetrics();
  }, [products, updateStorageMetrics]);

  const saveToStorage = useCallback((data: ProductData[], updatedProduct?: ProductData) => {
    // 1. Immediately write to localStorage (caught if quota exceeded)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateStorageMetrics();
      } catch (e) {
        console.warn('LocalStorage quota exceeded (cloud sync will preserve data)', e);
      }
    }

    // 2. Debounce Supabase network call
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        setShowAutoSaveToast(true);
        setTimeout(() => setShowAutoSaveToast(false), 1500);

        if (getStoredSupabaseConfig()) {
          setIsSyncing(true);
          if (updatedProduct) {
            await saveProductToSupabase(updatedProduct);
          } else {
            await saveAllProductsToSupabase(data);
          }
          setIsSyncing(false);
        }
      } catch (err) {
        console.warn('Supabase save failed', err);
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

  const addProduct = useCallback((initialData?: Partial<ProductData>): ProductData => {
    let createdProduct: ProductData | null = null;
    setProducts((prev) => {
      const maxSeq = prev.reduce((max, p) => Math.max(max, p.seq || 0), 0);
      const newProduct: ProductData = {
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
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
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
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
      saveToStorage(next);
      if (getStoredSupabaseConfig()) {
        deleteProductFromSupabase(id);
      }
      return next;
    });
  }, [saveToStorage]);

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

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      } catch (e) {
        console.warn('LocalStorage quota exceeded on import, saving to Supabase cloud', e);
      }
    }

    if (getStoredSupabaseConfig()) {
      setIsSyncing(true);
      await saveAllProductsToSupabase(sanitized);
      setIsSyncing(false);
    }
  }, []);

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
