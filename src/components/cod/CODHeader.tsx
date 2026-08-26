'use client';

import React from 'react';
import { Plus, DollarSign, Truck, CheckCircle, Percent, Wallet } from 'lucide-react';
import { CODSummaryStats } from '../../types/codLogistics';
import { formatFCFA } from '../../utils/formatters';

interface CODHeaderProps {
  stats: CODSummaryStats;
  onOpenCreateOrder: () => void;
  onOpenSettlement: () => void;
}

export const CODHeader: React.FC<CODHeaderProps> = ({
  stats,
  onOpenCreateOrder,
  onOpenSettlement,
}) => {
  const isHealthyRate = stats.deliveryRatePct >= 75;

  return (
    <div className="cod-header-wrap">
      <div className="cod-header-top">
        <div>
          <h1 className="cod-title">🚚 Suivi des Commandes COD & Gestion des Livreurs</h1>
          <p className="cod-subtitle">
            Pilotez vos livraisons Cash on Delivery (COD), suivez vos livreurs et sécurisez vos encaissements quotidiens en FCFA.
          </p>
        </div>

        <div className="cod-top-actions">
          <button type="button" className="btn-cod-settlement" onClick={onOpenSettlement}>
            <Wallet className="w-4 h-4" />
            <span>Point de Caisse Livreurs</span>
          </button>
          <button type="button" className="btn-create-cod" onClick={onOpenCreateOrder}>
            <Plus className="w-4 h-4" />
            <span>Nouvelle Commande Client</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="cod-stats-grid">
        <div className="cod-stat-card">
          <div className="cod-stat-icon"><Percent className={`w-4 h-4 ${isHealthyRate ? 'text-emerald-400' : 'text-amber-400'}`} /></div>
          <div>
            <div className={`cod-stat-num ${isHealthyRate ? 'text-emerald-400' : 'text-amber-400'}`}>
              {stats.deliveryRatePct}%
            </div>
            <div className="cod-stat-lbl">Taux de Livraison Réel ({stats.deliveredCount} livrés / {stats.cancelledCount} refusés)</div>
          </div>
        </div>

        <div className="cod-stat-card">
          <div className="cod-stat-icon"><Truck className="w-4 h-4 text-sky-400" /></div>
          <div>
            <div className="cod-stat-num">{stats.outForDeliveryCount} en cours</div>
            <div className="cod-stat-lbl">Sur {stats.totalOrders} commandes totales ({stats.toConfirmCount} à confirmer)</div>
          </div>
        </div>

        <div className="cod-stat-card">
          <div className="cod-stat-icon"><DollarSign className="w-4 h-4 text-gold-deep" /></div>
          <div>
            <div className="cod-stat-num">{formatFCFA(stats.totalGrossCashFCFA)}</div>
            <div className="cod-stat-lbl">Cash Brut Encaissé</div>
          </div>
        </div>

        <div className="cod-stat-card highlight">
          <div className="cod-stat-icon"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>
          <div>
            <div className="cod-stat-num text-emerald-400">{formatFCFA(stats.totalNetCashFCFA)}</div>
            <div className="cod-stat-lbl">Cash Net en Caisse (après livreurs)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
