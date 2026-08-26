'use client';

import React from 'react';
import { PieChart, Info } from 'lucide-react';
import { CashflowBreakdownItem } from '../../types/financeTypes';
import { formatFCFA } from '../../utils/formatters';

interface CashflowBreakdownCardProps {
  breakdown: CashflowBreakdownItem[];
}

export const CashflowBreakdownCard: React.FC<CashflowBreakdownCardProps> = ({ breakdown }) => {
  const totalAmount = breakdown.reduce((sum, item) => sum + item.amountFCFA, 0);

  return (
    <div className="cashflow-card">
      <div className="cashflow-header">
        <div className="cashflow-title">
          <PieChart className="w-5 h-5 text-gold-deep" />
          <h3>Où part chaque Franc de Chiffre d'Affaires ?</h3>
        </div>
        <span className="cashflow-badge">Répartition des Coûts & Bénéfice</span>
      </div>

      {totalAmount === 0 ? (
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', fontSize: '12.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>
            Ce graphique s'actualise automatiquement dès que vous passez des commandes à <strong>« Livré & Encaissé »</strong> dans le module <strong>Suivi COD</strong> ou que vous ajoutez vos premières dépenses.
          </span>
        </div>
      ) : (
        <>
          {/* Multi-segment progress bar */}
          <div className="cashflow-multi-bar">
            {breakdown.map((item, idx) => {
              if (item.pctOfRevenue <= 0) return null;
              return (
                <div
                  key={idx}
                  className="bar-segment"
                  style={{ width: `${Math.max(2, item.pctOfRevenue)}%`, backgroundColor: item.color }}
                  title={`${item.label}: ${item.pctOfRevenue}%`}
                />
              );
            })}
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
        </>
      )}
    </div>
  );
};
