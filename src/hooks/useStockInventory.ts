'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { StockMovement, StockItem, StockSummaryStats } from '../types/stockTypes';
import { ProductData } from '../types/product';
import { CODOrder } from '../types/codLogistics';
import { calculateCOGS } from '../utils/calculations';

const STOCK_MOVEMENTS_KEY = 'siftly_stock_movements_v1';
const STOCK_MANUAL_OVERRIDES_KEY = 'siftly_stock_manual_v1';

export function useStockInventory(products: ProductData[], orders: CODOrder[]) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [manualStockMap, setManualStockMap] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedMovements = localStorage.getItem(STOCK_MOVEMENTS_KEY);
      if (savedMovements) setMovements(JSON.parse(savedMovements));

      const savedManual = localStorage.getItem(STOCK_MANUAL_OVERRIDES_KEY);
      if (savedManual) setManualStockMap(JSON.parse(savedManual));
    } catch (e) {
      console.warn('Could not read stock data from storage', e);
    }
    setIsLoaded(true);
  }, []);

  const saveMovements = useCallback((newMovements: StockMovement[]) => {
    setMovements(newMovements);
    try {
      localStorage.setItem(STOCK_MOVEMENTS_KEY, JSON.stringify(newMovements));
    } catch (e) {
      console.warn('Could not save stock movements', e);
    }
  }, []);

  const saveManualMap = useCallback((newMap: Record<string, number>) => {
    setManualStockMap(newMap);
    try {
      localStorage.setItem(STOCK_MANUAL_OVERRIDES_KEY, JSON.stringify(newMap));
    } catch (e) {
      console.warn('Could not save stock manual map', e);
    }
  }, []);

  // Compute live stock per product
  const stockItems: StockItem[] = useMemo(() => {
    return products.map((p) => {
      const cogs = calculateCOGS(p);
      const sellingPrice = Number(p.vente) || 15000;

      // Base stock (default 50 or manual override)
      const baseStock = manualStockMap[p.id] !== undefined ? manualStockMap[p.id] : 50;

      // Deduct delivered and out-for-delivery orders
      const deliveredUnits = orders
        .filter((o) => (o.productId === p.id || o.productName === p.produit) && o.status === 'delivered')
        .reduce((sum, o) => sum + (o.quantity || 1), 0);

      const reservedUnits = orders
        .filter((o) => (o.productId === p.id || o.productName === p.produit) && o.status === 'out_for_delivery')
        .reduce((sum, o) => sum + (o.quantity || 1), 0);

      // Add movement changes
      const movementDelta = movements
        .filter((m) => m.productId === p.id)
        .reduce((sum, m) => sum + m.quantityChange, 0);

      const currentStock = Math.max(0, baseStock - deliveredUnits + movementDelta);
      const minThreshold = 10;
      const avgDailySales = Math.max(1, Math.round(deliveredUnits / 7) || 2);
      const daysOfStockLeft = Math.round(currentStock / avgDailySales);
      const isCriticalLow = currentStock <= minThreshold;

      return {
        productId: p.id,
        productName: p.produit || 'Produit sans nom',
        productImg: p.imgSrc,
        unitCOGSFCFA: cogs,
        sellingPriceFCFA: sellingPrice,
        currentStock,
        reservedStock: reservedUnits,
        minThreshold,
        avgDailySales,
        daysOfStockLeft,
        isCriticalLow,
      };
    });
  }, [products, orders, movements, manualStockMap]);

  // Compute summary stats
  const summaryStats: StockSummaryStats = useMemo(() => {
    let totalPhysicalUnits = 0;
    let totalStockValueFCFA = 0;
    let potentialRevenueFCFA = 0;
    let criticalLowCount = 0;

    stockItems.forEach((item) => {
      totalPhysicalUnits += item.currentStock;
      totalStockValueFCFA += item.currentStock * item.unitCOGSFCFA;
      potentialRevenueFCFA += item.currentStock * item.sellingPriceFCFA;
      if (item.isCriticalLow) criticalLowCount++;
    });

    return {
      totalSkus: stockItems.length,
      totalPhysicalUnits,
      totalStockValueFCFA,
      potentialRevenueFCFA,
      criticalLowCount,
    };
  }, [stockItems]);

  // Adjust stock
  const addMovement = useCallback((movementData: Omit<StockMovement, 'id' | 'date'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };
    saveMovements([newMovement, ...movements]);
  }, [movements, saveMovements]);

  const setManualStock = useCallback((productId: string, quantity: number) => {
    const updated = { ...manualStockMap, [productId]: quantity };
    saveManualMap(updated);
  }, [manualStockMap, saveManualMap]);

  return {
    stockItems,
    summaryStats,
    movements,
    isLoaded,
    addMovement,
    setManualStock,
  };
}
