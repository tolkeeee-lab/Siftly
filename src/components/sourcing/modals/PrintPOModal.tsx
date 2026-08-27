'use client';

import React from 'react';
import { X, Printer, Package, Building, Ship, Tag, DollarSign } from 'lucide-react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import {
  calculatePOMerchandiseTotalOriginal,
  calculatePOMerchandiseTotalFCFA,
  calculatePOFreightTotalFCFA,
  calculatePOLandedCostTotalFCFA,
  calculatePOLandedCostPerUnitFCFA,
  getPOStatusMeta,
} from '../../../utils/poCalculations';
import { formatFCFA } from '../../../utils/formatters';

interface PrintPOModalProps {
  po: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintPOModal: React.FC<PrintPOModalProps> = ({ po, isOpen, onClose }) => {
  if (!isOpen || !po) return null;

  const totalOrig = calculatePOMerchandiseTotalOriginal(po);
  const totalMerchandiseFCFA = calculatePOMerchandiseTotalFCFA(po);
  const totalFreightFCFA = calculatePOFreightTotalFCFA(po);
  const totalLandedFCFA = calculatePOLandedCostTotalFCFA(po);
  const landedPerUnitFCFA = calculatePOLandedCostPerUnitFCFA(po);
  const statusMeta = getPOStatusMeta(po.status);
  const currencySymbol = po.currency === 'RMB' ? '¥' : po.currency === 'USD' ? '$' : 'FCFA';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="one-pager-overlay open" onClick={onClose}>
      <div className="one-pager-container po-print-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls */}
        <div className="one-pager-header-controls no-print">
          <div className="po-print-header-badge">
            <span className="po-number-badge">{po.orderNumber}</span>
            <span className="po-print-header-badge-sub">
              Bon de Commande Officiel
            </span>
          </div>

          <div className="po-print-actions">
            <button type="button" className="tbtn save" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button type="button" className="rowdel" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="po-printable-area">
          <div className="po-doc-masthead">
            <div>
              <h1 className="po-doc-title">BON DE COMMANDE (PO)</h1>
              <div className="po-doc-ref">N° de Référence : <strong>{po.orderNumber}</strong></div>
              <div className="po-doc-date">Date d'émission : {new Date(po.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>

            <div className="po-doc-status-badge" style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}>
              {statusMeta.label}
            </div>
          </div>

          {/* Supplier & Forwarder Blocks */}
          <div className="po-doc-grid-2">
            <div className="po-doc-box">
              <div className="po-doc-box-title">
                <Building className="w-3.5 h-3.5" /> FOURNISSEUR (VENDEUR)
              </div>
              <div className="po-doc-line"><strong>Nom :</strong> {po.supplierName}</div>
              {po.supplierContact && <div className="po-doc-line"><strong>Contact :</strong> {po.supplierContact}</div>}
              {po.supplierLink && <div className="po-doc-line"><strong>Catalogue :</strong> {po.supplierLink}</div>}
            </div>

            <div className="po-doc-box">
              <div className="po-doc-box-title">
                <Ship className="w-3.5 h-3.5" /> TRANSITAIRE & EXPÉDITION
              </div>
              <div className="po-doc-line"><strong>Transitaire :</strong> {po.forwarderName} ({po.freightMode === 'avion' ? 'Fret Aérien ✈️' : 'Fret Maritime 🚢'})</div>
              <div className="po-doc-line"><strong>Shipping Mark :</strong> <span className="shipping-mark-badge">{po.shippingMark || 'N/A'}</span></div>
              {po.forwarderWarehouse && <div className="po-doc-line"><strong>Entrepôt Chine :</strong> {po.forwarderWarehouse}</div>}
            </div>
          </div>

          {/* Items Table */}
          <div className="po-doc-table-wrap">
            <table className="po-doc-table">
              <thead>
                <tr>
                  <th>Description de l'article</th>
                  <th className="text-center">Quantité</th>
                  <th className="text-right">Prix Usine ({po.currency})</th>
                  <th className="text-right">Total ({po.currency})</th>
                  <th className="text-right">Total (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{po.productName}</strong>
                    {po.variants && po.variants.length > 0 && (
                      <div className="po-variants-list">
                        {po.variants.map((v) => `${v.name} (${v.quantity} pcs)`).join(' · ')}
                      </div>
                    )}
                  </td>
                  <td className="text-center-bold">{po.quantity} pcs</td>
                  <td className="text-right">{currencySymbol}{po.unitPriceOriginal}</td>
                  <td className="text-right-bold">{currencySymbol}{totalOrig.toLocaleString()}</td>
                  <td className="text-right-value">{formatFCFA(totalMerchandiseFCFA)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="po-doc-summary-grid">
            <div className="po-doc-notes">
              <strong>Instructions de conditionnement :</strong>
              <p>
                Emballage renforcé sous carton double cannelure étanche. 
                Apposer la mention <strong>« {po.shippingMark} »</strong> en gros sur les 4 faces de chaque carton.
              </p>
            </div>

            <div className="po-doc-totals-box">
              <div className="po-tot-line">
                <span>Total Marchandise :</span>
                <strong>{formatFCFA(totalMerchandiseFCFA)}</strong>
              </div>
              <div className="po-tot-line">
                <span>Fret estimé ({po.estimatedWeightKg} kg) :</span>
                <strong>{formatFCFA(totalFreightFCFA)}</strong>
              </div>
              <div className="po-tot-line grand-total">
                <span>Total Estimé Rendu :</span>
                <strong className="text-emerald-700">{formatFCFA(totalLandedFCFA)}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#666', textAlign: 'right', marginTop: '4px' }}>
                Coût de revient unitaire : <strong>~{formatFCFA(landedPerUnitFCFA)} / pièce</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
