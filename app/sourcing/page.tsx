'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { usePurchaseOrders } from '../../src/hooks/usePurchaseOrders';
import { calculatePOSummaryStats } from '../../src/utils/poCalculations';
import { PurchaseOrder, POStatus } from '../../src/types/purchaseOrder';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { SourcingHeader } from '../../src/components/sourcing/SourcingHeader';
import { SourcingFilterBar, POFilterKey } from '../../src/components/sourcing/SourcingFilterBar';
import { PurchaseOrderList } from '../../src/components/sourcing/PurchaseOrderList';
import { CreatePOModal } from '../../src/components/sourcing/modals/CreatePOModal';
import { WhatsAppMessageModal } from '../../src/components/sourcing/modals/WhatsAppMessageModal';
import { PrintPOModal } from '../../src/components/sourcing/modals/PrintPOModal';

export default function SourcingPage() {
  const { products } = useProducts();
  const { orders, addOrder, updateOrder, deleteOrder } = usePurchaseOrders();

  const [activeFilter, setActiveFilter] = useState<POFilterKey>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [whatsAppPO, setWhatsAppPO] = useState<PurchaseOrder | null>(null);
  const [printPO, setPrintPO] = useState<PurchaseOrder | null>(null);

  // Stats calculation
  const stats = useMemo(() => calculatePOSummaryStats(orders), [orders]);

  // Filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<POFilterKey, number> = {
      all: orders.length,
      negotiating: 0,
      paid: 0,
      warehouse_china: 0,
      in_transit: 0,
      customs_cleared: 0,
      stocked: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const handleUpdateStatus = (id: string, status: POStatus) => {
    updateOrder(id, { status });
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <SourcingHeader
          stats={stats}
          onOpenCreatePO={() => setIsCreateModalOpen(true)}
        />

        <SourcingFilterBar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          filterCounts={filterCounts}
        />

        <PurchaseOrderList
          orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
          onOpenWhatsApp={(po) => setWhatsAppPO(po)}
          onOpenPrint={(po) => setPrintPO(po)}
          onDelete={deleteOrder}
          onOpenCreatePO={() => setIsCreateModalOpen(true)}
        />
      </div>

      <CreatePOModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        products={products}
        onSavePO={addOrder}
      />

      <WhatsAppMessageModal
        po={whatsAppPO}
        isOpen={!!whatsAppPO}
        onClose={() => setWhatsAppPO(null)}
      />

      <PrintPOModal
        po={printPO}
        isOpen={!!printPO}
        onClose={() => setPrintPO(null)}
      />
    </div>
  );
}
