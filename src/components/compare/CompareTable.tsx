'use client';

import React from 'react';
import { ComparedProductMetric } from '../../types/compareTypes';
import { formatFCFA, getScoreColorStyle, getMarginColorStyle } from '../../utils/formatters';

interface CompareTableProps {
  metrics: ComparedProductMetric[];
}

export const CompareTable: React.FC<CompareTableProps> = ({ metrics }) => {
  if (metrics.length === 0) {
    return (
      <div className="compare-empty-msg">
        Veuillez sélectionner au moins 2 produits à comparer ci-dessus.
      </div>
    );
  }

  const criteriaKeys = [
    { key: 'douleur', label: '1. Douleur du problème' },
    { key: 'nonres', label: '2. Problème non-résolu' },
    { key: 'etendue', label: '3. Étendue du besoin' },
    { key: 'impact', label: '4. Impact sur le client' },
    { key: 'waouh', label: '5. Effet Waouh visuel' },
    { key: 'innovant', label: '6. Caractère innovant' },
    { key: 'nonsaison', label: '7. Non-saisonnier' },
    { key: 'habitudes', label: '8. Facile à adopter' },
    { key: 'poidsfacteur', label: '9. Facteur Poids léger' },
  ];

  return (
    <div className="compare-table-container">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="sticky-col header-corner">Critères Comparatifs</th>
            {metrics.map((m, idx) => (
              <th key={m.product.id} className={`product-header-cell ${m.isBestScore ? 'winner-col' : ''}`}>
                <div className="compare-col-header">
                  <div className="compare-img-box">
                    {m.product.imgSrc ? (
                      <img src={m.product.imgSrc} alt={m.product.produit} />
                    ) : (
                      <span style={{ fontSize: '11px', color: '#999' }}>Sans photo</span>
                    )}
                  </div>
                  <h4 className="compare-prod-name">{m.product.produit || `Produit #${idx + 1}`}</h4>
                  <div className="compare-score-pill" style={getScoreColorStyle(m.noteNum)}>
                    Note : {m.noteNum.toFixed(1)} / 5
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Section 1: Financials */}
          <tr className="section-divider-row">
            <td colSpan={metrics.length + 1}>💰 BILAN FINANCIER & RENTABILITÉ (FCFA)</td>
          </tr>

          <tr>
            <td className="sticky-col">Prix de Vente Public</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-mono font-bold">
                {formatFCFA(Number(m.product.vente) || 0)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky-col">Prix Sourcing Usine</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-mono">
                {formatFCFA(Number(m.product.sourcing) || 0)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky-col">Poids & Coût Fret</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-mono">
                {m.product.poids || 0} kg ({formatFCFA(m.freightCostFCFA)})
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky-col">COGS Total (Coût de Revient)</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-mono">
                {formatFCFA(m.cogsFCFA)}
              </td>
            ))}
          </tr>

          <tr className="highlight-row">
            <td className="sticky-col font-bold">Marge Brute / Pièce (FCFA & %)</td>
            {metrics.map((m) => (
              <td
                key={m.product.id}
                className={`text-center font-mono font-bold ${m.isBestMargin ? 'best-value' : ''}`}
                style={getMarginColorStyle(m.marginPct, true)}
              >
                {formatFCFA(m.marginFCFA)} ({m.marginPct.toFixed(1)}%)
                {m.isBestMargin && <span className="best-tag">🏆 Max Marge</span>}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky-col">Seuil Rentabilité (Ventes/jour)</td>
            {metrics.map((m) => (
              <td
                key={m.product.id}
                className={`text-center font-mono ${m.isBestBreakEven ? 'best-value' : ''}`}
              >
                <strong>{m.breakEvenDailySales} v/jour</strong>
                {m.isBestBreakEven && <span className="best-tag green">⚡ Plus Facile</span>}
              </td>
            ))}
          </tr>

          {/* Section 2: Validation Scores */}
          <tr className="section-divider-row">
            <td colSpan={metrics.length + 1}>⭐ 9 CRITÈRES DE VALIDATION PRODUIT (SUR 5)</td>
          </tr>

          {criteriaKeys.map((crit) => (
            <tr key={crit.key}>
              <td className="sticky-col">{crit.label}</td>
              {metrics.map((m) => {
                const val = Number((m.product as any)[crit.key]) || 0;
                return (
                  <td key={m.product.id} className="text-center font-mono">
                    <span className="crit-score-badge" style={getScoreColorStyle(val)}>
                      {val.toFixed(1)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Section 3: Marketing */}
          <tr className="section-divider-row">
            <td colSpan={metrics.length + 1}>🎯 STRATÉGIE MARKETING & CIBLAGE</td>
          </tr>

          <tr>
            <td className="sticky-col">Cible Visée</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-sm">
                {m.product.cible || 'Non spécifiée'}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky-col">Angle d'Attaque</td>
            {metrics.map((m) => (
              <td key={m.product.id} className="text-center font-sm font-italic">
                {m.product.angle || 'Non spécifié'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
