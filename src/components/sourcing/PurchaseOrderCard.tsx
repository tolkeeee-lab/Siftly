'use client';

import React from 'react';
import {
  MessageSquare,
  Printer,
  Trash2,
  ExternalLink,
  Ship,
  Plane,
  Building,
  Tag,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { PurchaseOrder, POStatus } from '../../types/purchaseOrder';
import {
  calculatePOMerchandiseTotalOriginal,
  calculatePOMerchandiseTotalFCFA,
  calculatePOFreightTotalFCFA,
  calculatePOLandedCostTotalFCFA,
  calculatePOLandedCostPerUnitFCFA,
  getPOStatusMeta,
} from '../../utils/poCalculations';
import { formatFCFA } from '../../utils/formatters';

interface PurchaseOrderCardProps {
  po: PurchaseOrder;
  onUpdateStatus: (id: string, status: POStatus) => void;
  onOpenWhatsApp: (po: PurchaseOrder) => void;
  onOpenPrint: (po: PurchaseOrder) => void;
  onDelete: (id: string) => void;
}

export const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  po,
  onUpdateStatus,
  onOpenWhatsApp,
  onOpenPrint,
  onDelete,
}) => {
  const statusMeta = getPOStatusMeta(po.status);
  const totalOrig = calculatePOMerchandiseTotalOriginal(po);
  const totalMerchandiseFCFA = calculatePOMerchandiseTotalFCFA(po);
  const totalFreightFCFA = calculatePOFreightTotalFCFA(po);
  const totalLandedFCFA = calculatePOLandedCostTotalFCFA(po);
  const landedPerUnitFCFA = calculatePOLandedCostPerUnitFCFA(po);

  const currencySymbol = po.currency === 'RMB' ? '¥' : po.currency === 'USD' ? '$' : 'FCFA';

  const statusOptions: Array<{ value: POStatus; label: string }> = [
    { value: 'negotiating', label: '📝 En négociation' },
    { value: 'paid', label: '💳 Payé au fournisseur' },
    { value: 'warehouse_china', label: '🏢 Reçu entrepôt Chine' },
    { value: 'in_transit', label: '🚢 En transit (Mer/Vol)' },
    { value: 'customs_cleared', label: '🛃 Arrivé & Dédouané' },
    { value: 'stocked', label: '📦 En stock magasin' },
  ];

  return (
    <div className="po-card">
      {/* Top Header */}
      <div className="po-card-header">
        <div className="po-card-header-left">
          <span className="po-number-badge">{po.orderNumber}</span>
          <span className="po-date-lbl">
            {new Date(po.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Status Dropdown */}
        <select
          className="po-status-select"
          style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
          value={po.status}
          onChange={(e) => onUpdateStatus(po.id, e.target.value as POStatus)}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Product + Sourcing & Logistics */}
      <div className="po-card-body">
        {/* Left: Product & Supplier */}
        <div className="po-card-left">
          <div className="po-prod-row">
            <div className="po-img-box">
              {po.productImg ? (
                <img src={po.productImg} alt={po.productName} />
              ) : (
                <span className="po-img-placeholder">Photo</span>
              )}
            </div>
            <div className="po-prod-info">
              <h3 className="po-prod-title">{po.productName}</h3>
              <div className="po-supplier-line">
                <Building className="w-3 h-3 text-gold-deep" />
                <span>{po.supplierName || 'Fournisseur direct'}</span>
                {po.supplierLink && (
                  <a href={po.supplierLink} target="_blank" rel="noopener noreferrer" className="po-link">
                    1688 <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Variants / Breakdown */}
          {po.variants && po.variants.length > 0 && (
            <div className="po-variants-box">
              <div className="po-variants-title">Détail des pièces :</div>
              <div className="po-variants-list">
                {po.variants.map((v) => (
                  <span key={v.id} className="po-variant-chip">
                    {v.name} : <strong>{v.quantity} pcs</strong> ({currencySymbol}{v.unitPrice})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Financial & Logistics Summary */}
        <div className="po-card-right">
          {/* Financial Breakdown */}
          <div className="po-fin-box">
            <div className="po-fin-grid">
              <div className="po-fin-item">
                <span className="po-fin-lbl">Quantité</span>
                <span className="po-fin-val">{po.quantity} pcs</span>
              </div>
              <div className="po-fin-item">
                <span className="po-fin-lbl">Prix Usine ({po.currency})</span>
                <span className="po-fin-val">{currencySymbol}{po.unitPriceOriginal}</span>
              </div>
              <div className="po-fin-item">
                <span className="po-fin-lbl">Total Marchandise</span>
                <span className="po-fin-val bold text-gold-deep">{formatFCFA(totalMerchandiseFCFA)}</span>
              </div>
              <div className="po-fin-item">
                <span className="po-fin-lbl">Fret Estimé ({po.freightMode === 'avion' ? '✈️ Avion' : '🚢 Bateau'})</span>
                <span className="po-fin-val">{formatFCFA(totalFreightFCFA)} ({po.estimatedWeightKg || 0} kg)</span>
              </div>
              <div className="po-fin-item full">
                <span className="po-fin-lbl">Coût Rendu Magasin (Total & Par pièce)</span>
                <span className="po-fin-val large text-emerald-400">
                  {formatFCFA(totalLandedFCFA)} · <strong style={{ color: '#fff' }}>~{formatFCFA(landedPerUnitFCFA)} / pc</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Forwarder & Shipping Mark */}
          <div className="po-logistics-box">
            <div className="po-log-row">
              <span className="po-log-lbl"><Ship className="w-3 h-3 inline mr-1 text-sky-400" /> Transitaire :</span>
              <strong className="po-log-val">{po.forwarderName || 'Non spécifié'}</strong>
            </div>
            {po.shippingMark && (
              <div className="po-log-row">
                <span className="po-log-lbl"><Tag className="w-3 h-3 inline mr-1 text-amber-400" /> Shipping Mark :</span>
                <span className="shipping-mark-badge">{po.shippingMark}</span>
              </div>
            )}
            {po.trackingNumber && (
              <div className="po-log-row">
                <span className="po-log-lbl"><Clock className="w-3 h-3 inline mr-1 text-purple-400" /> Tracking / ETA :</span>
                <span className="po-log-val">{po.trackingNumber} {po.estimatedArrivalDate ? `(Arrivée : ${po.estimatedArrivalDate})` : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="po-card-footer">
        <div className="po-footer-left">
          <button
            type="button"
            className="po-action-btn whatsapp"
            title="Générer message WhatsApp pour le transitaire ou fournisseur"
            onClick={() => onOpenWhatsApp(po)}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message WhatsApp</span>
          </button>

          <button
            type="button"
            className="po-action-btn print"
            title="Imprimer / Exporter le Bon de Commande (PDF)"
            onClick={() => onOpenPrint(po)}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Bon de Commande (PDF)</span>
          </button>
        </div>

        <button
          type="button"
          className="rowdel"
          title="Supprimer cette commande"
          onClick={() => onDelete(po.id)}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-700" />
        </button>
      </div>
    </div>
  );
};
