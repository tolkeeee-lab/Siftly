'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
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

  if (!isOpen || !product) return null;

  const result = calculateBreakEven(product, batchQty, fixedAdBudget);

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Calculator className="w-5 h-5 text-gold-deep" />
          <h2 style={{ margin: 0 }}>Seuil de Rentabilité — {product.produit || 'Produit'}</h2>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--ink-soft)' }}>
          Simulez le nombre d'unités à vendre pour rembourser votre investissement initial (Sourcing + Transport + Pub).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500 }}>Stock initial commandé (unités)</label>
            <input
              className="cell-in"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '8px' }}
              type="number"
              min="1"
              value={batchQty}
              onChange={(e) => setBatchQty(Math.max(1, parseInt(e.target.value) || 0))}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500 }}>Budget Pub Lancement (FCFA)</label>
            <input
              className="cell-in"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '8px' }}
              type="number"
              min="0"
              value={fixedAdBudget}
              onChange={(e) => setFixedAdBudget(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
        </div>

        {!result.isProfitable ? (
          <div style={{ background: 'var(--rust-wash)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--rust)' }}>
            <AlertCircle className="w-4 h-4 inline mr-1" />
            <strong>Attention : Marge unitaire négative ou nulle.</strong> Augmentez votre prix de vente ou réduisez le coût de revient.
          </div>
        ) : (
          <div style={{ background: 'var(--sage-wash)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '8px' }}>
              <span>Investissement Total Initial :</span>
              <strong>{formatFCFA(result.totalInitialInvestment)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '8px' }}>
              <span>Seuil de Rentabilité (Unités à vendre) :</span>
              <strong style={{ fontSize: '16px', color: 'var(--gold-deep)' }}>
                {result.breakEvenUnits} unités / {batchQty} ({result.sellThroughPctNeeded}% du stock)
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--panel-line)', paddingBottom: '8px' }}>
              <span>Chiffre d'Affaires d'Équilibre :</span>
              <strong>{formatFCFA(result.breakEvenRevenue)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>Profit Net Estimé à 100% de vente :</span>
              <strong style={{ color: result.potentialProfitAtFullSell >= 0 ? 'var(--sage)' : 'var(--rust)' }}>
                {formatFCFA(result.potentialProfitAtFullSell)}
              </strong>
            </div>
          </div>
        )}

        <div className="paste-actions" style={{ marginTop: '16px' }}>
          <button type="button" className="paste-confirm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
