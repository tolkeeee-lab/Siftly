'use client';

import React from 'react';
import {
  MessageSquare,
  Trash2,
  MapPin,
  Phone,
  User,
  Package,
  Bike,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { CODOrder, CODStatus, Livreur } from '../../types/codLogistics';
import { getCODStatusMeta } from '../../utils/codCalculations';
import { formatFCFA } from '../../utils/formatters';

interface CODOrderCardProps {
  order: CODOrder;
  livreurs: Livreur[];
  onUpdateStatus: (id: string, status: CODStatus) => void;
  onUpdateLivreur: (id: string, livreurId: string, livreurName: string, deliveryFee: number) => void;
  onOpenCustomerWA: (order: CODOrder) => void;
  onOpenLivreurWA: (order: CODOrder) => void;
  onDelete: (id: string) => void;
}

export const CODOrderCard: React.FC<CODOrderCardProps> = ({
  order,
  livreurs,
  onUpdateStatus,
  onUpdateLivreur,
  onOpenCustomerWA,
  onOpenLivreurWA,
  onDelete,
}) => {
  const statusMeta = getCODStatusMeta(order.status);

  const statusOptions: Array<{ value: CODStatus; label: string }> = [
    { value: 'to_confirm', label: '📞 À Confirmer' },
    { value: 'ready_to_ship', label: '📦 Prêt à expédier' },
    { value: 'out_for_delivery', label: '🛵 En Livraison' },
    { value: 'delivered', label: '💵 Livré & Encaissé' },
    { value: 'postponed', label: '🔄 Reporté' },
    { value: 'cancelled', label: '❌ Annulé / Refusé' },
  ];

  const handleLivreurChange = (livreurId: string) => {
    const selected = livreurs.find((l) => l.id === livreurId);
    if (selected) {
      onUpdateLivreur(order.id, selected.id, selected.name, selected.deliveryFee);
    } else {
      onUpdateLivreur(order.id, '', '', 1500);
    }
  };

  return (
    <div className={`cod-order-card ${order.status === 'delivered' ? 'delivered-border' : ''}`}>
      {/* Header */}
      <div className="cod-card-header">
        <div className="cod-card-header-left">
          <span className="cod-order-badge">{order.orderNumber}</span>
          <span className="cod-date-lbl">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Status Dropdown */}
        <select
          className="cod-status-select"
          style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
          value={order.status}
          onChange={(e) => onUpdateStatus(order.id, e.target.value as CODStatus)}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid */}
      <div className="cod-card-body">
        {/* Customer & Product Info */}
        <div className="cod-card-left">
          <div className="cod-customer-name">
            <User className="w-3.5 h-3.5 text-gold-deep" />
            <strong>{order.customerName}</strong>
          </div>

          <div className="cod-info-line">
            <Phone className="w-3 h-3 text-emerald-400" />
            <a href={`tel:${order.customerPhone}`} className="cod-phone-link">
              {order.customerPhone}
            </a>
          </div>

          <div className="cod-info-line">
            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
            <span>{order.customerCity} · {order.customerAddress}</span>
          </div>

          <div className="cod-prod-tag">
            <Package className="w-3 h-3 text-gold-deep" />
            <span>{order.productName} (x{order.quantity})</span>
          </div>
        </div>

        {/* Financial & Livreur Info */}
        <div className="cod-card-right">
          <div className="cod-price-box">
            <span className="cod-price-lbl">Montant à Encaisser :</span>
            <div className="cod-price-val text-gold-deep">{formatFCFA(order.totalPriceFCFA)}</div>
          </div>

          {/* Livreur Assignment */}
          <div className="cod-livreur-assign-box">
            <div className="cod-liv-lbl">
              <Bike className="w-3 h-3 text-purple-400" /> Livreur assigné :
            </div>
            <select
              className="cod-livreur-card-select"
              value={order.livreurId || ''}
              onChange={(e) => handleLivreurChange(e.target.value)}
            >
              <option value="">-- Assigner un livreur --</option>
              {livreurs.map((liv) => (
                <option key={liv.id} value={liv.id}>
                  {liv.name} ({formatFCFA(liv.deliveryFee)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="cod-card-footer">
        <div className="cod-actions-left">
          <button
            type="button"
            className="btn-cod-wa customer"
            title="Envoyer message WhatsApp de confirmation au client"
            onClick={() => onOpenCustomerWA(order)}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Client</span>
          </button>

          <button
            type="button"
            className="btn-cod-wa livreur"
            title="Envoyer la fiche de course WhatsApp au livreur"
            onClick={() => onOpenLivreurWA(order)}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Course Livreur</span>
          </button>
        </div>

        <button
          type="button"
          className="rowdel"
          title="Supprimer cette commande"
          onClick={() => onDelete(order.id)}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-700" />
        </button>
      </div>
    </div>
  );
};
