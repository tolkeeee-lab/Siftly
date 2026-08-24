'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductData } from '../types/product';
import { INITIAL_PRODUCTS } from '../constants/defaultData';

const STORAGE_KEY = 'eaa-produits-benin';

export function useProducts() {
  const [products, setProducts] = useState<ProductData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read saved products from localStorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToStorage = useCallback((data: ProductData[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setShowAutoSaveToast(true);
        setTimeout(() => setShowAutoSaveToast(false), 1500);
      } catch (err) {
        console.warn('Save failed', err);
      }
    }, 400);
  }, []);

  const updateProduct = useCallback((id: string, field: keyof ProductData, value: any) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, [field]: value } : p));
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const addProduct = useCallback((initialData?: Partial<ProductData>) => {
    setProducts((prev) => {
      const maxSeq = prev.reduce((max, p) => Math.max(max, p.seq || 0), 0);
      const newProduct: ProductData = {
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        seq: maxSeq + 1,
        produit: initialData?.produit || '',
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
      const next = [...prev, newProduct];
      saveToStorage(next);
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
      return next;
    });
  }, [saveToStorage]);

  const replaceAllProducts = useCallback((data: ProductData[]) => {
    setProducts(data);
    saveToStorage(data);
  }, [saveToStorage]);

  return {
    products,
    updateProduct,
    addProduct,
    addMultipleProducts,
    deleteProduct,
    replaceAllProducts,
    showAutoSaveToast,
  };
}
