'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { AppStats } from '../../types/product';

interface StatStripProps {
  stats: AppStats;
}

export const StatStrip: React.FC<StatStripProps> = ({ stats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="stats-container">
      <div className="stats-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="stats-summary">
          <BarChart2 className="w-3.5 h-3.5 text-gold" />
          <span className="stats-summary-text">
            <strong>{stats.count}</strong> {stats.count > 1 ? 'produits' : 'produit'} · Moy. <strong>{stats.avgNote}</strong> · Marge <strong>{stats.avgMargin}</strong>
          </span>
        </div>
        <button
          type="button"
          className="stats-toggle-btn"
          title={isCollapsed ? 'Afficher les statistiques complètes' : 'Masquer les statistiques'}
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          <span>{isCollapsed ? 'Déplier' : 'Réduire'}</span>
        </button>
      </div>

      {!isCollapsed && (
        <div className="stats">
          <div className="stat">
            <div className="num">{stats.count}</div>
            <div className="lbl">Produits saisis</div>
          </div>
          <div className="stat">
            <div className="num">{stats.avgNote}</div>
            <div className="lbl">Note finale moyenne</div>
          </div>
          <div className="stat">
            <div className="num">{stats.avgMargin}</div>
            <div className="lbl">Marge brute moyenne</div>
          </div>
          <div className="stat">
            <div className="num">{stats.topNote}</div>
            <div className="lbl">Meilleure note</div>
          </div>
          <div className="stat">
            <div className="num">{stats.topTarget}</div>
            <div className="lbl">Cible la plus citée</div>
          </div>
        </div>
      )}
    </div>
  );
};
