'use client';

import React from 'react';
import { PieChart } from 'lucide-react';
import { CashflowBreakdownItem } from '../../types/financeTypes';
import { formatFCFA } from '../../utils/formatters';

interface CashflowBreakdownCardProps {
  breakdown: CashflowBreakdownItem[];
}

export const CashflowBreakdownCard: React.FC<CashflowBreakdownCardProps> = ({ breakdown }) => {
  return (
    <div className="cashflow-card">
      <div className="cashflow-header">
        <div className="cashflow-title">
          <PieChart className="w-5 h-5 text-gold-deep" />
          <h3>Où part chaque Franc de Chiffre d'Affaires ?</h3>
        </div>
        <span className="cashflow-badge">Répartition des Coûts & Bénéfice</span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="cashflow-multi-bar">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className="bar-segment"
            style={{ width: `${Math.max(4, item.pctOfRevenue)}%`, backgroundColor: item.color }}
            title={`${item.label}: ${item.pctOfRevenue}%`}
          />
        ))}
      </div>

      {/* Breakdown Legend Grid */}
      <div className="cashflow-legend-grid">
        {breakdown.map((item, idx) => (
          <div key={idx} className="legend-item">
            <div className="legend-top">
              <span className="legend-color-dot" style={{ backgroundColor: item.color }} />
              <span className="legend-icon">{item.icon}</span>
              <span className="legend-label">{item.label}</span>
            </div>
            <div className="legend-bottom">
              <strong className="legend-pct" style={{ color: item.color }}>{item.pctOfRevenue}%</strong>
              <span className="legend-amount">{formatFCFA(item.amountFCFA)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
