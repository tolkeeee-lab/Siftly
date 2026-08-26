'use client';

import React from 'react';
import { Plus, Package, Ship, DollarSign } from 'lucide-react';
import { POSummaryStats } from '../../types/purchaseOrder';
import { formatFCFA } from '../../utils/formatters';

interface SourcingHeaderProps {
  stats: POSummaryStats;
  onOpenCreatePO: () => void;
}

export const SourcingHeader: React.FC<SourcingHeaderProps> = ({ stats, onOpenCreatePO }) => {
  return (
    <div className="sourcing-header-wrap">
      <div className="sourcing-header-top">
        <div>
          <h1 className="sourcing-title">📦 Sourcing & Bons de Commande Fournisseurs</h1>
          <p className="sourcing-subtitle">
            Générez vos bons de commande (PO) usine en Chine, suivez vos transitaires et calculez vos coûts de fret réels en FCFA.
          </p>
        </div>

        <button type="button" className="btn-create-po" onClick={onOpenCreatePO}>
          <Plus className="w-4 h-4" />
          <span>Nouveau Bon de Commande (PO)</span>
        </button>
      </div>

      {/* Sourcing Stats Strip */}
      <div className="sourcing-stats-grid">
        <div className="sourcing-stat-card">
          <div className="stat-card-icon"><Package className="w-4 h-4 text-gold-deep" /></div>
          <div>
            <div className="stat-card-num">{stats.totalOrders}</div>
            <div className="stat-card-lbl">Commandes ({stats.totalUnits} pièces)</div>
          </div>
        </div>

        <div className="sourcing-stat-card">
          <div className="stat-card-icon"><DollarSign className="w-4 h-4 text-emerald-400" /></div>
          <div>
            <div className="stat-card-num">{formatFCFA(stats.totalMerchandiseFCFA)}</div>
            <div className="stat-card-lbl">Total Marchandise</div>
          </div>
        </div>

        <div className="sourcing-stat-card">
          <div className="stat-card-icon"><Ship className="w-4 h-4 text-sky-400" /></div>
          <div>
            <div className="stat-card-num">{formatFCFA(stats.totalFreightFCFA)}</div>
            <div className="stat-card-lbl">Fret Estimé ({stats.inTransitCount} en mer/vol)</div>
          </div>
        </div>

        <div className="sourcing-stat-card">
          <div className="stat-card-icon"><DollarSign className="w-4 h-4 text-amber-400" /></div>
          <div>
            <div className="stat-card-num">{formatFCFA(stats.totalMerchandiseFCFA + stats.totalFreightFCFA)}</div>
            <div className="stat-card-lbl">Coût Total Rendu Magasin</div>
          </div>
        </div>
      </div>
    </div>
  );
};
