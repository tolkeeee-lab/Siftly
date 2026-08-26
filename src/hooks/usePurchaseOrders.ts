'use client';

import { useState, useEffect, useCallback } from 'react';
import { PurchaseOrder } from '../types/purchaseOrder';

const PO_LOCAL_STORAGE_KEY = 'siftly_purchase_orders_v1';

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PO_LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not read purchase orders from local storage', e);
      }
    }
    return [];
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save to local storage
  const saveOrders = useCallback((newOrders: PurchaseOrder[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(PO_LOCAL_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.warn('Could not save purchase orders to local storage', e);
    }
  }, []);

  // Add new PO
  const addOrder = useCallback((poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => {
    const now = new Date().toISOString();
    const count = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `PO-${year}-${String(count).padStart(3, '0')}`;

    const newOrder: PurchaseOrder = {
      ...poData,
      id: crypto.randomUUID(),
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  }, [orders, saveOrders]);

  // Update PO
  const updateOrder = useCallback((id: string, updates: Partial<PurchaseOrder>) => {
    const updated = orders.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    saveOrders(updated);
  }, [orders, saveOrders]);

  // Delete PO
  const deleteOrder = useCallback((id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
  }, [orders, saveOrders]);

  return {
    orders,
    isLoaded,
    isSyncing,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
