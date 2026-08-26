'use client';

import { useState, useEffect, useCallback } from 'react';
import { CODOrder, Livreur } from '../types/codLogistics';

const COD_ORDERS_STORAGE_KEY = 'siftly_cod_orders_v1';
const COD_LIVREURS_STORAGE_KEY = 'siftly_cod_livreurs_v1';

const DEFAULT_LIVREURS: Livreur[] = [
  { id: 'liv-1', name: 'Livreur Boris (Cotonou & Akpakpa)', phone: '+229 97 00 11 22', zone: 'Cotonou Centre', deliveryFee: 1500, returnFee: 500 },
  { id: 'liv-2', name: 'Livreur Jean (Calavi & Vedoko)', phone: '+229 96 33 44 55', zone: 'Abomey-Calavi', deliveryFee: 2000, returnFee: 500 },
  { id: 'liv-3', name: 'Livreur Franck (Cocody & Marcory)', phone: '+225 07 88 99 00', zone: 'Abidjan Sud', deliveryFee: 2000, returnFee: 1000 },
];

export function useCODOrders() {
  const [orders, setOrders] = useState<CODOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders = localStorage.getItem(COD_ORDERS_STORAGE_KEY);
        if (savedOrders) return JSON.parse(savedOrders);
      } catch (e) {
        console.warn('Could not read COD data from storage', e);
      }
    }
    return [];
  });

  const [livreurs, setLivreurs] = useState<Livreur[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLivreurs = localStorage.getItem(COD_LIVREURS_STORAGE_KEY);
        if (savedLivreurs) return JSON.parse(savedLivreurs);
      } catch (e) {
        console.warn('Could not read livreurs from storage', e);
      }
    }
    return DEFAULT_LIVREURS;
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const saveOrders = useCallback((newOrders: CODOrder[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(COD_ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.warn('Could not save COD orders to storage', e);
    }
  }, []);

  const saveLivreurs = useCallback((newLivreurs: Livreur[]) => {
    setLivreurs(newLivreurs);
    try {
      localStorage.setItem(COD_LIVREURS_STORAGE_KEY, JSON.stringify(newLivreurs));
    } catch (e) {
      console.warn('Could not save livreurs to storage', e);
    }
  }, []);

  // Add order
  const addOrder = useCallback((orderData: Omit<CODOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => {
    const now = new Date().toISOString();
    const count = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `COD-${year}-${String(count).padStart(3, '0')}`;

    const newOrder: CODOrder = {
      ...orderData,
      id: crypto.randomUUID(),
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  }, [orders, saveOrders]);

  // Update order
  const updateOrder = useCallback((id: string, updates: Partial<CODOrder>) => {
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

  // Delete order
  const deleteOrder = useCallback((id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
  }, [orders, saveOrders]);

  return {
    orders,
    livreurs,
    isLoaded,
    addOrder,
    updateOrder,
    deleteOrder,
    saveLivreurs,
  };
}
