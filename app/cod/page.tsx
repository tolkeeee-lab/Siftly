'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { useCODOrders } from '../../src/hooks/useCODOrders';
import { calculateCODSummaryStats } from '../../src/utils/codCalculations';
import { CODOrder, CODStatus } from '../../src/types/codLogistics';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { CODHeader } from '../../src/components/cod/CODHeader';
import { CODFilterBar, CODFilterStatusKey } from '../../src/components/cod/CODFilterBar';
import { CODOrderList } from '../../src/components/cod/CODOrderList';
import { CreateCODOrderModal } from '../../src/components/cod/modals/CreateCODOrderModal';
import { LivreurSettlementModal } from '../../src/components/cod/modals/LivreurSettlementModal';
import { CODWhatsAppModal } from '../../src/components/cod/modals/CODWhatsAppModal';

export default function CODLogisticsPage() {
  const { products } = useProducts();
  const { orders, livreurs, addOrder, updateOrder, deleteOrder } = useCODOrders();

  const [activeStatus, setActiveStatus] = useState<CODFilterStatusKey>('all');
  const [selectedLivreurId, setSelectedLivreurId] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [whatsAppModalData, setWhatsAppModalData] = useState<{
    order: CODOrder | null;
    target: 'customer' | 'livreur';
  }>({ order: null, target: 'customer' });

  // Stats calculation
  const stats = useMemo(() => calculateCODSummaryStats(orders), [orders]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<CODFilterStatusKey, number> = {
      all: orders.length,
      to_confirm: 0,
      ready_to_ship: 0,
      out_for_delivery: 0,
      delivered: 0,
      postponed: 0,
      cancelled: 0,
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
    return orders.filter((o) => {
      if (activeStatus !== 'all' && o.status !== activeStatus) return false;
      if (selectedLivreurId && o.livreurId !== selectedLivreurId) return false;
      return true;
    });
  }, [orders, activeStatus, selectedLivreurId]);

  const handleUpdateStatus = (id: string, status: CODStatus) => {
    updateOrder(id, { status });
  };

  const handleUpdateLivreur = (id: string, livreurId: string, livreurName: string, deliveryFee: number) => {
    updateOrder(id, {
      livreurId: livreurId || undefined,
      livreurName: livreurName || undefined,
      deliveryFeeFCFA: deliveryFee,
    });
  };

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <CODHeader
          stats={stats}
          onOpenCreateOrder={() => setIsCreateModalOpen(true)}
          onOpenSettlement={() => setIsSettlementModalOpen(true)}
        />

        <CODFilterBar
          activeStatus={activeStatus}
          onSelectStatus={setActiveStatus}
          statusCounts={statusCounts}
          livreurs={livreurs}
          selectedLivreurId={selectedLivreurId}
          onSelectLivreur={setSelectedLivreurId}
        />

        <CODOrderList
          orders={filteredOrders}
          livreurs={livreurs}
          onUpdateStatus={handleUpdateStatus}
          onUpdateLivreur={handleUpdateLivreur}
          onOpenCustomerWA={(order) => setWhatsAppModalData({ order, target: 'customer' })}
          onOpenLivreurWA={(order) => setWhatsAppModalData({ order, target: 'livreur' })}
          onDelete={deleteOrder}
          onOpenCreateOrder={() => setIsCreateModalOpen(true)}
        />
      </div>

      <CreateCODOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        products={products}
        livreurs={livreurs}
        onSaveOrder={addOrder}
      />

      <LivreurSettlementModal
        orders={orders}
        livreurs={livreurs}
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
      />

      <CODWhatsAppModal
        order={whatsAppModalData.order}
        target={whatsAppModalData.target}
        isOpen={!!whatsAppModalData.order}
        onClose={() => setWhatsAppModalData({ order: null, target: 'customer' })}
      />
    </div>
  );
}
