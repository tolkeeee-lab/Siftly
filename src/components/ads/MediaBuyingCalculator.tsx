'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Target, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';
import { ProductData } from '../../types/product';
import { calculateCOGS } from '../../utils/calculations';
import { calculateMediaBuyingMetrics } from '../../utils/mediaBuyingCalculations';
import { formatFCFA } from '../../utils/formatters';

interface MediaBuyingCalculatorProps {
  product: ProductData | null;
}

export const MediaBuyingCalculator: React.FC<MediaBuyingCalculatorProps> = ({ product }) => {
  const sellingPrice = Number(product?.vente) || 12500;
  const cogs = product ? calculateCOGS(product) : 5500;

  const [deliveryRate, setDeliveryRate] = useState<number>(80);
  const [returnFee, setReturnFee] = useState<number>(1000);
  const [testBudget, setTestBudget] = useState<number>(30000);

  const metrics = calculateMediaBuyingMetrics(
    sellingPrice,
    cogs,
    deliveryRate,
    returnFee,
    testBudget
  );

  return (
    <div className="mb-calc-card">
      <div className="mb-calc-header">
        <div className="mb-calc-title">
          <Calculator className="w-5 h-5 text-gold-deep" />
          <h3>Calculateur de Media Buying (CPA & ROAS Cible)</h3>
        </div>
        <span className="mb-calc-badge">Règle des 50% de Marge Pub</span>
      </div>

      {/* Primary KPI Grid */}
      <div className="mb-kpi-grid">
        <div className="mb-kpi-box highlight-gold">
          <div className="mb-kpi-lbl">
            <Target className="w-3.5 h-3.5" /> CPA Cible Recommandé (Max / Achat)
          </div>
          <div className="mb-kpi-val text-gold-deep">{formatFCFA(metrics.maxTargetCPAFCFA)}</div>
          <div className="mb-kpi-hint">Ne dépassez pas ce coût par commande sur Facebook/TikTok Ads.</div>
        </div>

        <div className="mb-kpi-box">
          <div className="mb-kpi-lbl">
            <TrendingUp className="w-3.5 h-3.5" /> ROAS Seuil d'Équilibre
          </div>
          <div className="mb-kpi-val">{metrics.breakEvenROAS}x</div>
          <div className="mb-kpi-hint">10 000 F de pub dépensés doivent générer au moins {formatFCFA(Math.round(10000 * metrics.breakEvenROAS))} de ventes.</div>
        </div>

        <div className="mb-kpi-box">
          <div className="mb-kpi-lbl">Marge Brute / Vente</div>
          <div className="mb-kpi-val text-emerald-400">{formatFCFA(metrics.grossMarginFCFA)}</div>
          <div className="mb-kpi-hint">Prix ({formatFCFA(sellingPrice)}) - COGS ({formatFCFA(cogs)})</div>
        </div>
      </div>

      {/* Test Budget Simulation */}
      <div className="mb-sim-section">
        <div className="mb-sim-title">
          <span>📊 Simulation sur votre Budget Pub Test :</span>
          <div className="mb-budget-input-wrap">
            <label>Budget Test :</label>
            <input
              type="number"
              step="5000"
              className="mb-budget-in"
              value={testBudget}
              onChange={(e) => setTestBudget(Math.max(5000, parseInt(e.target.value) || 0))}
            />
            <span>FCFA</span>
          </div>
        </div>

        <div className="mb-sim-results-grid">
          <div className="mb-sim-card">
            <div className="sim-lbl">Commandes Attendues</div>
            <div className="sim-val">~{metrics.expectedOrdersForBudget} commandes</div>
          </div>

          <div className="mb-sim-card">
            <div className="sim-lbl">Colis Livrés ({deliveryRate}%)</div>
            <div className="sim-val">{Math.floor(metrics.expectedOrdersForBudget * (deliveryRate / 100))} livrés</div>
          </div>

          <div className="mb-sim-card">
            <div className="sim-lbl">Bénéfice Net Projeté</div>
            <div className={`sim-val bold ${metrics.projectedNetProfitFCFA >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatFCFA(metrics.projectedNetProfitFCFA)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
