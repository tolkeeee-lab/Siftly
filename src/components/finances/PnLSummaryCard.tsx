'use client';

import React from 'react';
import { DollarSign, ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';
import { PnLStatement } from '../../types/financeTypes';
import { formatFCFA } from '../../utils/formatters';

interface PnLSummaryCardProps {
  pnl: PnLStatement;
}

export const PnLSummaryCard: React.FC<PnLSummaryCardProps> = ({ pnl }) => {
  return (
    <div className="pnl-summary-card">
      <div className="pnl-header">
        <DollarSign className="w-5 h-5 text-gold-deep" />
        <h3>Compte de Résultat Simplifié (Bilan d'Exploitation)</h3>
      </div>

      <div className="pnl-table-wrap">
        <table className="pnl-statement-table">
          <tbody>
            {/* 1. Revenue */}
            <tr className="pnl-row-header">
              <td><strong>(+) CHIFFRE D'AFFAIRES ENCAISSÉ (CASH COD)</strong></td>
              <td className="text-right text-gold-deep"><strong>{formatFCFA(pnl.grossRevenueFCFA)}</strong></td>
            </tr>

            {/* 2. Direct Costs */}
            <tr className="pnl-row-sub">
              <td>&nbsp;&nbsp;(-) Coût des marchandises vendues (Sourcing + Fret Chine)</td>
              <td className="text-right text-red-600">- {formatFCFA(pnl.cogsFCFA)}</td>
            </tr>

            {/* Gross Profit */}
            <tr className="pnl-row-total">
              <td><strong>(=) MARGE BRUTE COMMERCIALE ({pnl.grossMarginPct}%)</strong></td>
              <td className="text-right"><strong>{formatFCFA(pnl.grossProfitFCFA)}</strong></td>
            </tr>

            {/* 3. Operating Expenses */}
            <tr className="pnl-row-sub">
              <td>&nbsp;&nbsp;(-) Dépenses Publicitaires (Facebook & TikTok Ads)</td>
              <td className="text-right text-red-600">- {formatFCFA(pnl.totalAdSpendFCFA)}</td>
            </tr>
            <tr className="pnl-row-sub">
              <td>&nbsp;&nbsp;(-) Frais de Livraison & Commissions Livreurs</td>
              <td className="text-right text-red-600">- {formatFCFA(pnl.totalDeliveryFeesFCFA)}</td>
            </tr>
            <tr className="pnl-row-sub">
              <td>&nbsp;&nbsp;(-) Pertes sur retours / colis refusés</td>
              <td className="text-right text-red-600">- {formatFCFA(pnl.totalReturnLossesFCFA)}</td>
            </tr>
            <tr className="pnl-row-sub">
              <td>&nbsp;&nbsp;(-) Frais généraux (Emballages, forfaits, divers)</td>
              <td className="text-right text-red-600">- {formatFCFA(pnl.totalGeneralExpensesFCFA)}</td>
            </tr>

            {/* Total OPEX */}
            <tr className="pnl-row-total" style={{ color: '#888' }}>
              <td><em>(=) Total des Charges d'Exploitation (OPEX)</em></td>
              <td className="text-right"><em>- {formatFCFA(pnl.totalOperatingExpensesFCFA)}</em></td>
            </tr>

            {/* Net Result */}
            <tr className="pnl-row-net-result">
              <td>
                <span className="net-badge">RÉSULTAT NET</span>
                <strong>(=) BÉNÉFICE NET RÉEL ({pnl.netMarginPct}% du CA)</strong>
              </td>
              <td className="text-right net-amount">
                <strong>{formatFCFA(pnl.netProfitFCFA)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
