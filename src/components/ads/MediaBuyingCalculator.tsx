'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Target, TrendingUp, Sliders, RotateCcw, Truck } from 'lucide-react';
import { ProductData } from '../../types/product';
import { calculateCOGS } from '../../utils/calculations';
import { calculateMediaBuyingMetrics } from '../../utils/mediaBuyingCalculations';
import { formatFCFA } from '../../utils/formatters';

interface MediaBuyingCalculatorProps {
  product: ProductData | null;
}

export const MediaBuyingCalculator: React.FC<MediaBuyingCalculatorProps> = ({ product }) => {
  const initialSellingPrice = Number(product?.vente) || 12500;
  const initialCOGS = product ? calculateCOGS(product) : 5500;

  // Fully customizable financial & media buying parameters
  const [sellingPrice, setSellingPrice] = useState<number>(initialSellingPrice);
  const [cogs, setCogs] = useState<number>(initialCOGS);
  const [customCPA, setCustomCPA] = useState<number | null>(null);
  const [deliveryRate, setDeliveryRate] = useState<number>(80);
  const [returnFee, setReturnFee] = useState<number>(1000);
  const [testBudget, setTestBudget] = useState<number>(30000);

  // Sync when product changes
  useEffect(() => {
    setSellingPrice(Number(product?.vente) || 12500);
    setCogs(product ? calculateCOGS(product) : 5500);
    setCustomCPA(null);
  }, [product?.id, product?.vente, product?.sourcing]);

  // Compute metrics
  const defaultMetrics = calculateMediaBuyingMetrics(
    sellingPrice,
    cogs,
    deliveryRate,
    returnFee,
    testBudget
  );

  const activeCPA = customCPA !== null && customCPA > 0 ? customCPA : defaultMetrics.maxTargetCPAFCFA;
  const expectedOrders = activeCPA > 0 ? Math.floor(testBudget / activeCPA) : 0;
  const deliveredOrders = Math.floor(expectedOrders * (deliveryRate / 100));
  const returnedOrders = expectedOrders - deliveredOrders;
  const grossProfitDelivered = (sellingPrice - cogs) * deliveredOrders;
  const totalReturnCost = returnedOrders * returnFee;
  const projectedNetProfit = grossProfitDelivered - totalReturnCost - testBudget;
  const grossMargin = sellingPrice - cogs;
  const breakEvenROAS = sellingPrice > 0 && grossMargin > 0
    ? Math.round((sellingPrice / grossMargin) * 10) / 10
    : 3.5;

  const handleReset = () => {
    setSellingPrice(initialSellingPrice);
    setCogs(initialCOGS);
    setCustomCPA(null);
    setDeliveryRate(80);
    setReturnFee(1000);
    setTestBudget(30000);
  };

  return (
    <div className="mb-calc-card">
      <div className="mb-calc-header">
        <div className="mb-calc-title">
          <Calculator className="w-5 h-5 text-gold-deep" />
          <h3>Calculateur de Media Buying & Simulateur CPA/ROAS</h3>
        </div>
        <button type="button" className="btn-reset-metrics" onClick={handleReset} title="Réinitialiser les chiffres">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Editable Parameters Strip */}
      <div className="mb-inputs-strip">
        <div className="mb-field-group">
          <label>Prix de Vente (FCFA)</label>
          <input
            type="number"
            className="mb-editable-in bold"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <div className="mb-field-group">
          <label>Coût Marchandise COGS (FCFA)</label>
          <input
            type="number"
            className="mb-editable-in"
            value={cogs}
            onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <div className="mb-field-group">
          <label>CPA Cible / Achat (FCFA)</label>
          <input
            type="number"
            className="mb-editable-in text-gold-deep bold"
            placeholder={`Auto: ${formatFCFA(defaultMetrics.maxTargetCPAFCFA)}`}
            value={customCPA ?? activeCPA}
            onChange={(e) => setCustomCPA(Number(e.target.value) || null)}
          />
        </div>

        <div className="mb-field-group">
          <label>Taux Livraison COD (%)</label>
          <input
            type="number"
            min="10"
            max="100"
            className="mb-editable-in"
            value={deliveryRate}
            onChange={(e) => setDeliveryRate(Math.min(100, Math.max(10, Number(e.target.value) || 80)))}
          />
        </div>

        <div className="mb-field-group">
          <label>Frais par Retour (FCFA)</label>
          <input
            type="number"
            className="mb-editable-in"
            value={returnFee}
            onChange={(e) => setReturnFee(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <div className="mb-field-group highlight">
          <label>Budget Pub Test (FCFA)</label>
          <input
            type="number"
            step="5000"
            className="mb-editable-in font-extrabold"
            value={testBudget}
            onChange={(e) => setTestBudget(Math.max(1000, Number(e.target.value) || 0))}
          />
        </div>
      </div>

      {/* Real-time KPI Results Grid */}
      <div className="mb-kpi-grid">
        <div className="mb-kpi-box highlight-gold">
          <div className="mb-kpi-lbl">
            <Target className="w-3.5 h-3.5" /> CPA Cible Réel (Max Toléré)
          </div>
          <div className="mb-kpi-val text-gold-deep">{formatFCFA(activeCPA)}</div>
          <div className="mb-kpi-hint">Ne dépassez pas ce coût par commande sur Facebook/TikTok Ads.</div>
        </div>

        <div className="mb-kpi-box">
          <div className="mb-kpi-lbl">
            <TrendingUp className="w-3.5 h-3.5" /> ROAS Seuil d'Équilibre
          </div>
          <div className="mb-kpi-val">{breakEvenROAS}x</div>
          <div className="mb-kpi-hint">10 000 F de pub doivent générer au moins {formatFCFA(Math.round(10000 * breakEvenROAS))} de ventes.</div>
        </div>

        <div className="mb-kpi-box">
          <div className="mb-kpi-lbl">Marge Brute / Vente</div>
          <div className="mb-kpi-val text-emerald-600">{formatFCFA(grossMargin)}</div>
          <div className="mb-kpi-hint">Prix ({formatFCFA(sellingPrice)}) - COGS ({formatFCFA(cogs)})</div>
        </div>
      </div>

      {/* Test Budget Simulation Cards */}
      <div className="mb-sim-results-grid">
        <div className="mb-sim-card">
          <div className="sim-lbl">Commandes Attendues</div>
          <div className="sim-val">~{expectedOrders} commandes</div>
        </div>

        <div className="mb-sim-card">
          <div className="sim-lbl">Colis Livrés ({deliveryRate}%)</div>
          <div className="sim-val">{deliveredOrders} livrés ({returnedOrders} retours)</div>
        </div>

        <div className="mb-sim-card highlight-profit">
          <div className="sim-lbl">Bénéfice Net Projeté</div>
          <div className={`sim-val bold ${projectedNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {projectedNetProfit >= 0 ? '+' : ''}{formatFCFA(projectedNetProfit)}
          </div>
        </div>
      </div>
    </div>
  );
};
