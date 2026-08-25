'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  Truck,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import { ProductData } from '../../types/product';
import { calculateBreakEven } from '../../utils/breakEven';
import { formatFCFA } from '../../utils/formatters';

interface BreakEvenModalProps {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BreakEvenModal: React.FC<BreakEvenModalProps> = ({ product, isOpen, onClose }) => {
  const [batchQty, setBatchQty] = useState<number>(50);
  const [fixedAdBudget, setFixedAdBudget] = useState<number>(50000);
  const [dailyFixedCosts, setDailyFixedCosts] = useState<number>(5000);
  const [targetDays, setTargetDays] = useState<number>(20);
  const [deliveryRate, setDeliveryRate] = useState<number>(80);
  const [returnFee, setReturnFee] = useState<number>(1000);

  if (!isOpen || !product) return null;

  const result = calculateBreakEven(
    product,
    batchQty,
    fixedAdBudget,
    dailyFixedCosts,
    targetDays,
    deliveryRate,
    returnFee
  );

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Calculator className="w-5 h-5 text-gold-deep" />
          <h2 style={{ margin: 0, fontSize: '19px' }}>
            Rentabilité & Seuil COD — {product.produit || 'Produit'}
          </h2>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
          Simulateur financier adapté au marché ouest-africain (Cash on Delivery, charges et objectifs quotidiens).
        </p>

        {/* Input Parameters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              <Package className="w-3 h-3 inline mr-1" />
              Stock commandé
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="1"
              value={batchQty}
              onChange={(e) => setBatchQty(Math.max(1, parseInt(e.target.value) || 0))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              <DollarSign className="w-3 h-3 inline mr-1" />
              Budget Pub Test
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="0"
              step="5000"
              value={fixedAdBudget}
              onChange={(e) => setFixedAdBudget(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              <Calendar className="w-3 h-3 inline mr-1" />
              Délai d'écoulement
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="1"
              value={targetDays}
              onChange={(e) => setTargetDays(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              Charges fixes / jour
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="0"
              step="1000"
              value={dailyFixedCosts}
              onChange={(e) => setDailyFixedCosts(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              <Truck className="w-3 h-3 inline mr-1" />
              Taux Livraison COD (%)
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="10"
              max="100"
              value={deliveryRate}
              onChange={(e) => setDeliveryRate(Math.min(100, Math.max(10, parseInt(e.target.value) || 10)))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)' }}>
              Frais retour livreur
            </label>
            <input
              className="cell-in num"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '6px', fontSize: '13px' }}
              type="number"
              min="0"
              value={returnFee}
              onChange={(e) => setReturnFee(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
        </div>

        {!result.isProfitable ? (
          <div style={{ background: 'var(--rust-wash)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--rust)' }}>
            <AlertCircle className="w-4 h-4 inline mr-1" />
            <strong>Attention : Marge unitaire négative ou nulle.</strong> Augmentez votre prix de vente ({formatFCFA(Number(product.vente))}) ou réduisez le coût de revient ({formatFCFA(result.unitCOGS)}).
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Daily Target Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #141B32 0%, #1F2A4A 100%)',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(247,242,228,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🎯 Objectif Ventes / Jour (Stock)
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gold)', fontFamily: 'monospace' }}>
                  {result.dailySalesForStock} ventes / jour
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(247,242,228,0.6)' }}>
                  Pour écouler les {batchQty} pièces en {targetDays} jours
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'rgba(247,242,228,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Seuil Rentabilité Quotidien
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#68D391', fontFamily: 'monospace' }}>
                  {result.dailySalesForBreakEven} ventes / jour
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(247,242,228,0.6)' }}>
                  Pour atteindre le point mort ({result.breakEvenUnits} unités au total)
                </div>
              </div>
            </div>

            {/* COD vs Standard Analysis Card */}
            <div style={{ background: 'var(--sage-wash)', padding: '14px 16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp className="w-4 h-4" /> Analyse Réelle COD (Taux de Livraison {deliveryRate}%) :
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '6px', fontSize: '13px' }}>
                <span>Marge Nette Réelle / Commande expédiée :</span>
                <strong style={{ color: result.codAverageNetMarginPerAttempt >= 0 ? 'var(--sage)' : 'var(--rust)', fontFamily: 'monospace' }}>
                  {formatFCFA(result.codAverageNetMarginPerAttempt)}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '6px', fontSize: '13px' }}>
                <span>Seuil de Rentabilité (Unités à livrer) :</span>
                <strong style={{ color: 'var(--gold-deep)', fontFamily: 'monospace' }}>
                  {result.breakEvenUnits} unités ({result.sellThroughPctNeeded}% du stock)
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '6px', fontSize: '13px' }}>
                <span>Investissement Total Initial (Stock + Pub + Charges) :</span>
                <strong style={{ fontFamily: 'monospace' }}>{formatFCFA(result.totalInitialInvestment)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', fontSize: '14px' }}>
                <span>Bénéfice Net Réel Estimé (après retours et charges) :</span>
                <strong style={{ color: result.codTotalNetProfit >= 0 ? '#1A5218' : '#8B2E1A', fontSize: '16px', fontFamily: 'monospace' }}>
                  {formatFCFA(result.codTotalNetProfit)}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className="paste-actions" style={{ marginTop: '14px' }}>
          <button type="button" className="paste-confirm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
