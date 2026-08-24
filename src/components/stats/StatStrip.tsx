'use client';

import React from 'react';
import { AppStats } from '../../types/product';

interface StatStripProps {
  stats: AppStats;
}

export const StatStrip: React.FC<StatStripProps> = ({ stats }) => {
  return (
    <div className="stats-scroll-wrap">
      <div className="stats">
        <div className="stat">
          <div className="num">{stats.count}</div>
          <div className="lbl">Produits saisis</div>
        </div>
        <div className="stat">
          <div className="num">{stats.avgNote}</div>
          <div className="lbl">Note moy.</div>
        </div>
        <div className="stat">
          <div className="num">{stats.avgMargin}</div>
          <div className="lbl">Marge moy.</div>
        </div>
        <div className="stat">
          <div className="num">{stats.topNote}</div>
          <div className="lbl">Meilleure note</div>
        </div>
        <div className="stat">
          <div className="num">{stats.topTarget}</div>
          <div className="lbl">Cible majeure</div>
        </div>
      </div>
    </div>
  );
};
