'use client';

import React from 'react';
import { Truck, Plus } from 'lucide-react';
import { CODOrder, CODStatus, Livreur } from '../../types/codLogistics';
import { CODOrderCard } from './CODOrderCard';

interface CODOrderListProps {
  orders: CODOrder[];
  livreurs: Livreur[];
  onUpdateStatus: (id: string, status: CODStatus) => void;
  onUpdateLivreur: (id: string, livreurId: string, livreurName: string, deliveryFee: number) => void;
  onOpenCustomerWA: (order: CODOrder) => void;
  onOpenLivreurWA: (order: CODOrder) => void;
  onDelete: (id: string) => void;
  onOpenCreateOrder: () => void;
}

export const CODOrderList: React.FC<CODOrderListProps> = ({
  orders,
  livreurs,
  onUpdateStatus,
  onUpdateLivreur,
  onOpenCustomerWA,
  onOpenLivreurWA,
  onDelete,
  onOpenCreateOrder,
}) => {
  if (orders.length === 0) {
    return (
      <div className="po-empty-state">
        <div className="po-empty-icon-wrap">
          <Truck className="w-10 h-10 text-gold-deep" />
        </div>
        <h3 className="po-empty-title">Aucune commande pour le moment</h3>
        <p className="po-empty-desc">
          Enregistrez les commandes de vos clients pour suivre les livraisons COD et sécuriser vos encaissements cash.
        </p>
        <button type="button" className="btn-create-cod" onClick={onOpenCreateOrder}>
          <Plus className="w-4 h-4" />
          <span>Créer une Commande Client</span>
        </button>
      </div>
    );
  }

  return (
    <div className="cod-orders-grid">
      {orders.map((order) => (
        <CODOrderCard
          key={order.id}
          order={order}
          livreurs={livreurs}
          onUpdateStatus={onUpdateStatus}
          onUpdateLivreur={onUpdateLivreur}
          onOpenCustomerWA={onOpenCustomerWA}
          onOpenLivreurWA={onOpenLivreurWA}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
