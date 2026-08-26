'use client';

import React from 'react';
import { Gift, Sliders, DollarSign, Package, Sparkles } from 'lucide-react';
import { ProductData } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';

interface OffersHeaderProps {
  products: ProductData[];
  selectedProduct: ProductData | null;
  onSelectProduct: (productId: string) => void;
  testBudgetFCFA: number;
  onChangeTestBudget: (val: number) => void;
  estimatedCPAFCFA: number;
  onChangeCPA: (val: number) => void;
  initialStock: number;
  onChangeStock: (val: number) => void;
}

export const OffersHeader: React.FC<OffersHeaderProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  testBudgetFCFA,
  onChangeTestBudget,
  estimatedCPAFCFA,
  onChangeCPA,
  initialStock,
  onChangeStock,
}) => {
  return (
    <div className="offers-header-container">
      {/* Title & Badge */}
      <div className="offers-hero-section">
        <div className="offers-badge-pill">
          <Gift className="w-3.5 h-3.5 text-gold-deep inline mr-1.5" />
          <span>LABORATOIRE D'OFFRES & BUNDLES IRRESTIBLES</span>
        </div>
        <h2 className="offers-hero-title">
          Créateur & Simulateur d'Offres <em>Spécial Petit Budget</em>
        </h2>
        <p className="offers-hero-subtitle">
          Testez 4 formules d'offres (Duo remisé, Bundles, 2+1 Offert, VIP) pour identifier l'offre qui génère le maximum de bénéfice net avec votre budget disponible.
        </p>
      </div>

      {/* Control Panel: Product & Budget */}
      <div className="offers-controls-card">
        <div className="control-group-col">
          <label className="control-label">
            <Package className="w-3.5 h-3.5 text-gold-deep inline mr-1" />
            1. Choisissez le Produit à Modéliser
          </label>
          <select
            className="offers-product-select"
            value={selectedProduct?.id || ''}
            onChange={(e) => onSelectProduct(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.seq} {p.produit || 'Produit sans titre'} — Vente: {formatFCFA(p.vente || 0)} (Sourcing: {formatFCFA(p.sourcing || 0)})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group-col">
          <label className="control-label">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
            2. Budget Pub Test Alloué (FCFA)
          </label>
          <div className="quick-budget-chips">
            {[20000, 30000, 50000, 100000].map((b) => (
              <button
                key={b}
                type="button"
                className={`budget-chip ${testBudgetFCFA === b ? 'active' : ''}`}
                onClick={() => onChangeTestBudget(b)}
              >
                {b / 1000}k
              </button>
            ))}
            <input
              type="number"
              className="budget-custom-input"
              value={testBudgetFCFA}
              onChange={(e) => onChangeTestBudget(Number(e.target.value) || 30000)}
              title="Budget pub personnalisé en FCFA"
            />
          </div>
        </div>

        <div className="control-group-col">
          <label className="control-label">
            <Sliders className="w-3.5 h-3.5 text-sky-600 inline mr-1" />
            3. CPA Pub Estimé / Achat (FCFA)
          </label>
          <input
            type="number"
            className="offers-cpa-input"
            value={estimatedCPAFCFA}
            onChange={(e) => onChangeCPA(Number(e.target.value) || 2500)}
            placeholder="2500"
          />
        </div>
      </div>
    </div>
  );
};
