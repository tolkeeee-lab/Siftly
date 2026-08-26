'use client';

import React from 'react';
import { TrendingUp, Award, DollarSign, Check, HelpCircle } from 'lucide-react';
import { OfferStructure } from '../../types/offerTypes';
import { formatFCFA } from '../../utils/formatters';

interface OfferSimulatorBreakdownProps {
  offers: OfferStructure[];
  testBudgetFCFA: number;
}

export const OfferSimulatorBreakdown: React.FC<OfferSimulatorBreakdownProps> = ({
  offers,
  testBudgetFCFA,
}) => {
  return (
    <div className="simulator-breakdown-card">
      <div className="breakdown-header">
        <div className="breakdown-title-row">
          <TrendingUp className="w-4 h-4 text-gold-deep" />
          <h3>Matrice Comparative de Rentabilité Financière</h3>
        </div>
        <span className="breakdown-budget-tag">
          Simulation basée sur un budget pub test de {formatFCFA(testBudgetFCFA)}
        </span>
      </div>

      <div className="breakdown-table-wrapper">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Structure d'Offre</th>
              <th>Panier Moyen (AOV)</th>
              <th>Coût Achat (COGS)</th>
              <th>Marge / Commande</th>
              <th>CAC Max Toléré</th>
              <th>Bénéfice Net Projeté</th>
              <th>Score Global</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className={offer.isRecommendedWinner ? 'winner-row' : ''}>
                <td>
                  <div className="offer-cell-title">
                    <strong>{offer.title}</strong>
                    {offer.isRecommendedWinner && (
                      <span className="mini-winner-tag">🏆 1er Choix</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="mono-val">{formatFCFA(offer.averageOrderValueFCFA)}</span>
                </td>
                <td>
                  <span className="mono-val">{formatFCFA(offer.cogsPerOrderFCFA)}</span>
                </td>
                <td>
                  <strong className="text-emerald-600 font-bold">
                    {formatFCFA(offer.netMarginPerOrderFCFA)}
                  </strong>
                </td>
                <td>
                  <span className="cac-pill">{formatFCFA(offer.maxAllowableCACFCFA)}</span>
                </td>
                <td>
                  <strong className={offer.totalNetProfitFCFA >= 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                    {offer.totalNetProfitFCFA >= 0 ? '+' : ''}{formatFCFA(offer.totalNetProfitFCFA)}
                  </strong>
                </td>
                <td>
                  <span className="score-pill">
                    {offer.overallRankScore}/100
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="breakdown-insights-footer">
        <div className="insight-bullet">
          <Check className="w-3.5 h-3.5 text-emerald-600 inline mr-1 flex-shrink-0" />
          <span>
            <strong>Règle d'or Petit Budget :</strong> Privilégiez l'offre qui offre le <strong>CAC Max Toléré</strong> le plus élevé, car cela vous donne de la marge d'erreur pour tester vos publicités sans perdre d'argent.
          </span>
        </div>
      </div>
    </div>
  );
};
