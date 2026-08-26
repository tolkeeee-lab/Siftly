'use client';

import React from 'react';
import { Plus, Package, AlertTriangle, DollarSign, Layers } from 'lucide-react';
import { StockSummaryStats } from '../../types/stockTypes';
import { formatFCFA } from '../../utils/formatters';

interface StockHeaderProps {
  stats: StockSummaryStats;
  onOpenAddMovement: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ stats, onOpenAddMovement }) => {
  return (
    <div className="stock-header-wrap">
      <div className="stock-header-top">
        <div>
          <h1 className="stock-title">📦 Gestionnaire de Stock Magasin & Alertes Anti-Rupture</h1>
          <p className="stock-subtitle">
            Suivez vos pièces physiques en rayon, anticipez les ruptures et gérez vos réceptions de colis en provenance de Chine.
          </p>
        </div>

        <button type="button" className="btn-add-stock-in" onClick={onOpenAddMovement}>
          <Plus className="w-4 h-4" />
          <span>+ Réception Arrivage / Ajustement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stock-stats-grid">
        <div className="stock-stat-card">
          <div className="stock-stat-icon"><Package className="w-4 h-4 text-gold-deep" /></div>
          <div>
            <div className="stock-stat-num">{stats.totalPhysicalUnits} pièces</div>
            <div className="stock-stat-lbl">Stock Physique Total ({stats.totalSkus} SKUs)</div>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-stat-icon"><DollarSign className="w-4 h-4 text-emerald-400" /></div>
          <div>
            <div className="stock-stat-num">{formatFCFA(stats.totalStockValueFCFA)}</div>
            <div className="stock-stat-lbl">Valeur Stock à Prix d'Achat (COGS)</div>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-stat-icon"><Layers className="w-4 h-4 text-sky-400" /></div>
          <div>
            <div className="stock-stat-num text-gold-deep">{formatFCFA(stats.potentialRevenueFCFA)}</div>
            <div className="stock-stat-lbl">Chiffre d'Affaires Potentiel</div>
          </div>
        </div>

        <div className={`stock-stat-card ${stats.criticalLowCount > 0 ? 'critical-alert' : ''}`}>
          <div className="stock-stat-icon"><AlertTriangle className="w-4 h-4 text-amber-400" /></div>
          <div>
            <div className={`stock-stat-num ${stats.criticalLowCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {stats.criticalLowCount} alertes
            </div>
            <div className="stock-stat-lbl">Produits Proches de la Rupture (&le; 10 pcs)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
