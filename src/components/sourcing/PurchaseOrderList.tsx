'use client';

import React from 'react';
import { Package, Plus } from 'lucide-react';
import { PurchaseOrder, POStatus } from '../../types/purchaseOrder';
import { PurchaseOrderCard } from './PurchaseOrderCard';

interface PurchaseOrderListProps {
  orders: PurchaseOrder[];
  onUpdateStatus: (id: string, status: POStatus) => void;
  onOpenWhatsApp: (po: PurchaseOrder) => void;
  onOpenPrint: (po: PurchaseOrder) => void;
  onDelete: (id: string) => void;
  onOpenCreatePO: () => void;
}

export const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({
  orders,
  onUpdateStatus,
  onOpenWhatsApp,
  onOpenPrint,
  onDelete,
  onOpenCreatePO,
}) => {
  if (orders.length === 0) {
    return (
      <div className="po-empty-state">
        <div className="po-empty-icon-wrap">
          <Package className="w-10 h-10 text-gold-deep" />
        </div>
        <h3 className="po-empty-title">Aucun bon de commande pour le moment</h3>
        <p className="po-empty-desc">
          Créez votre premier bon de commande fournisseur (PO) à partir d'un produit gagnant sélectionné dans Siftly.
        </p>
        <button type="button" className="btn-create-po" onClick={onOpenCreatePO}>
          <Plus className="w-4 h-4" />
          <span>Créer un Bon de Commande</span>
        </button>
      </div>
    );
  }

  return (
    <div className="po-list-grid">
      {orders.map((po) => (
        <PurchaseOrderCard
          key={po.id}
          po={po}
          onUpdateStatus={onUpdateStatus}
          onOpenWhatsApp={onOpenWhatsApp}
          onOpenPrint={onOpenPrint}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
