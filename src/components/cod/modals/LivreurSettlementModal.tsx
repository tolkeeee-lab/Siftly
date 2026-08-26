'use client';

import React, { useState } from 'react';
import { X, Wallet, Bike, CheckCircle, DollarSign } from 'lucide-react';
import { CODOrder, Livreur } from '../../../types/codLogistics';
import { calculateLivreurSettlement } from '../../../utils/codCalculations';
import { formatFCFA } from '../../../utils/formatters';

interface LivreurSettlementModalProps {
  orders: CODOrder[];
  livreurs: Livreur[];
  isOpen: boolean;
  onClose: () => void;
}

export const LivreurSettlementModal: React.FC<LivreurSettlementModalProps> = ({
  orders,
  livreurs,
  isOpen,
  onClose,
}) => {
  const [selectedLivreurId, setSelectedLivreurId] = useState<string>(livreurs[0]?.id || '');

  if (!isOpen) return null;

  const currentLivreur = livreurs.find((l) => l.id === selectedLivreurId) || livreurs[0];
  const settlement = currentLivreur
    ? calculateLivreurSettlement(orders, currentLivreur.id)
    : null;

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Wallet className="w-5 h-5 text-gold-deep" />
            <h2>Point de Caisse Journalier des Livreurs</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Select Livreur */}
        <div className="po-form-section" style={{ marginBottom: '14px' }}>
          <label className="po-form-label">Sélectionner le livreur :</label>
          <select
            className="po-select-input"
            value={selectedLivreurId}
            onChange={(e) => setSelectedLivreurId(e.target.value)}
          >
            {livreurs.map((liv) => (
              <option key={liv.id} value={liv.id}>
                {liv.name} ({liv.zone})
              </option>
            ))}
          </select>
        </div>

        {settlement && (
          <div className="cod-settlement-content">
            {/* KPI grid for rider */}
            <div className="cod-settle-grid">
              <div className="cod-settle-box">
                <div className="sim-lbl">Colis Assignés</div>
                <div className="sim-val">{settlement.totalAssigned} colis</div>
              </div>
              <div className="cod-settle-box">
                <div className="sim-lbl">Livrés & Encaissés</div>
                <div className="sim-val text-emerald-400">{settlement.deliveredCount} colis</div>
              </div>
              <div className="cod-settle-box">
                <div className="sim-lbl">En cours de route</div>
                <div className="sim-val">{settlement.outForDeliveryCount} colis</div>
              </div>
              <div className="cod-settle-box">
                <div className="sim-lbl">Refusés / Annulés</div>
                <div className="sim-val text-red-400">{settlement.cancelledCount} colis</div>
              </div>
            </div>

            {/* Financial Settlement Breakdown */}
            <div className="cod-settle-calc-card">
              <div className="settle-line">
                <span>Cash total collecté auprès des clients :</span>
                <strong className="text-gold-deep">{formatFCFA(settlement.totalGrossCashToCollect)}</strong>
              </div>
              <div className="settle-line">
                <span>Commissions dues au livreur ({settlement.deliveredCount} courses) :</span>
                <strong className="text-red-400">- {formatFCFA(settlement.totalFeesDueToLivreur)}</strong>
              </div>
              <div className="settle-line total">
                <span>MONTANT NET À RÉCUPÉRER EN ESPÈCES :</span>
                <strong className="text-emerald-400">{formatFCFA(settlement.netCashToReceive)}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="po-modal-footer">
          <button type="button" className="btn-save-po" onClick={onClose}>
            <CheckCircle className="w-4 h-4" />
            <span>Fermer le point de caisse</span>
          </button>
        </div>
      </div>
    </div>
  );
};
