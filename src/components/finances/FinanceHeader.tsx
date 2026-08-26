'use client';

import React from 'react';
import { Plus, Printer, DollarSign, TrendingUp, Percent, ShoppingBag } from 'lucide-react';
import { PnLStatement } from '../../types/financeTypes';
import { formatFCFA } from '../../utils/formatters';

interface FinanceHeaderProps {
  pnl: PnLStatement;
  onOpenAddExpense: () => void;
  onOpenPrintPnL: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  pnl,
  onOpenAddExpense,
  onOpenPrintPnL,
}) => {
  const isProfitable = pnl.netProfitFCFA >= 0;

  return (
    <div className="fin-header-wrap">
      <div className="fin-header-top">
        <div>
          <h1 className="fin-title">📊 Journal Financier & Compte de Résultat Net (P&L)</h1>
          <p className="fin-subtitle">
            Mesurez au franc près votre rentabilité nette après marchandise, pub Facebook/TikTok, livreurs et charges fixes.
          </p>
        </div>

        <div className="fin-top-actions">
          <button type="button" className="btn-print-pnl" onClick={onOpenPrintPnL}>
            <Printer className="w-4 h-4" />
            <span>Imprimer Bilan P&L (PDF)</span>
          </button>
          <button type="button" className="btn-add-expense" onClick={onOpenAddExpense}>
            <Plus className="w-4 h-4" />
            <span>+ Ajouter Dépense (Pub / Frais)</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial KPI Cards */}
      <div className="fin-stats-grid">
        <div className="fin-stat-card highlight-emerald">
          <div className="fin-stat-icon">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className={`fin-stat-num ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatFCFA(pnl.netProfitFCFA)}
            </div>
            <div className="fin-stat-lbl">BÉNÉFICE NET RÉEL EN POCHE</div>
          </div>
        </div>

        <div className="fin-stat-card">
          <div className="fin-stat-icon">
            <Percent className="w-4 h-4 text-gold-deep" />
          </div>
          <div>
            <div className="fin-stat-num text-gold-deep">{pnl.netMarginPct}%</div>
            <div className="fin-stat-lbl">Marge Nette Réelle (sur CA)</div>
          </div>
        </div>

        <div className="fin-stat-card">
          <div className="fin-stat-icon">
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="fin-stat-num">{formatFCFA(pnl.grossRevenueFCFA)}</div>
            <div className="fin-stat-lbl">Chiffre d'Affaires Encaissé ({pnl.totalDeliveredUnits} pcs)</div>
          </div>
        </div>

        <div className="fin-stat-card">
          <div className="fin-stat-icon">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="fin-stat-num">{formatFCFA(pnl.totalOperatingExpensesFCFA)}</div>
            <div className="fin-stat-lbl">Total Charges & Pub (OPEX)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
