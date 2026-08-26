'use client';

import React, { useState } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { useCODOrders } from '../../src/hooks/useCODOrders';
import { useStockInventory } from '../../src/hooks/useStockInventory';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { StockHeader } from '../../src/components/stock/StockHeader';
import { StockTable } from '../../src/components/stock/StockTable';
import { StockAdjustmentModal } from '../../src/components/stock/modals/StockAdjustmentModal';

export default function StockInventoryPage() {
  const { products } = useProducts();
  const { orders } = useCODOrders();
  const { stockItems, summaryStats, addMovement } = useStockInventory(products, orders);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickDelta = (productId: string, productName: string, delta: number) => {
    addMovement({
      productId,
      productName,
      type: delta > 0 ? 'po_inflow' : 'adjustment',
      quantityChange: delta,
      reason: delta > 0 ? 'Ajout rapide stock' : 'Retrait / Casse rapide',
    });
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <StockHeader
          stats={summaryStats}
          onOpenAddMovement={() => setIsModalOpen(true)}
        />

        <StockTable
          items={stockItems}
          onAddStockQuick={handleQuickDelta}
        />
      </div>

      <StockAdjustmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onSaveMovement={addMovement}
      />
    </div>
  );
}
