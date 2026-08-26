'use client';

import React, { useState, useMemo } from 'react';
import { Package, Plus, Trash2, Check, Sparkles, Store, Calculator, DollarSign } from 'lucide-react';
import { ProductData } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';

interface MultiProductBundleBuilderProps {
  products: ProductData[];
  mainProduct: ProductData;
  onApplyMultiBundle: (bundleName: string, selectedProducts: ProductData[], bundlePriceFCFA: number) => void;
}

export const MultiProductBundleBuilder: React.FC<MultiProductBundleBuilderProps> = ({
  products,
  mainProduct,
  onApplyMultiBundle,
}) => {
  // Array of selected product IDs in the custom bundle
  const [selectedIds, setSelectedIds] = useState<string[]>([mainProduct.id]);
  const [bundleName, setBundleName] = useState<string>(`Pack Synergie Complet (${mainProduct.produit})`);
  const [customBundlePrice, setCustomBundlePrice] = useState<number | null>(null);

  // Sync main product when it changes
  React.useEffect(() => {
    if (!selectedIds.includes(mainProduct.id)) {
      setSelectedIds([mainProduct.id]);
      setBundleName(`Pack Synergie Complet (${mainProduct.produit})`);
      setCustomBundlePrice(null);
    }
  }, [mainProduct.id]);

  // Selected products objects
  const bundleItems = useMemo(() => {
    return products.filter((p) => selectedIds.includes(p.id));
  }, [products, selectedIds]);

  // Financial calculations
  const totalOriginalPrice = useMemo(() => {
    return bundleItems.reduce((sum, p) => sum + (p.vente || 0), 0);
  }, [bundleItems]);

  const totalCOGS = useMemo(() => {
    return bundleItems.reduce((sum, p) => sum + (p.sourcing || 0), 0);
  }, [bundleItems]);

  const suggestedPrice = useMemo(() => {
    // 22% combo discount
    return Math.round((totalOriginalPrice * 0.78) / 100) * 100;
  }, [totalOriginalPrice]);

  const activePrice = customBundlePrice !== null ? customBundlePrice : suggestedPrice;
  const deliveryFee = 1500;
  const netMarginFCFA = activePrice - totalCOGS - deliveryFee;
  const discountPercent = totalOriginalPrice > 0 
    ? Math.round(((totalOriginalPrice - activePrice) / totalOriginalPrice) * 100) 
    : 0;

  const handleToggleProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      if (selectedIds.length === 1) return; // Keep at least 1
      setSelectedIds(selectedIds.filter((id) => id !== productId));
    } else {
      if (selectedIds.length >= 5) return; // Limit to 5
      setSelectedIds([...selectedIds, productId]);
    }
  };

  const handleApply = () => {
    onApplyMultiBundle(bundleName, bundleItems, activePrice);
  };

  return (
    <div className="multi-bundle-builder-card">
      <div className="multi-bundle-header">
        <div className="multi-bundle-title-group">
          <Sparkles className="w-5 h-5 text-gold-deep" />
          <div>
            <h3 className="multi-bundle-title">🧩 Constructeur de Pack Combiné Multi-Produits (2 à 5 Articles)</h3>
            <p className="multi-bundle-subtitle">
              Cochez les produits de votre catalogue que vous voulez regrouper dans une offre irrésistible.
            </p>
          </div>
        </div>
        <span className="selected-count-badge">
          {selectedIds.length} Produit{selectedIds.length > 1 ? 's' : ''} Sélectionné{selectedIds.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Product Selection Grid */}
      <div className="bundle-products-selector-grid">
        {products.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          const isMain = p.id === mainProduct.id;

          return (
            <div
              key={p.id}
              className={`bundle-select-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggleProduct(p.id)}
            >
              <div className="bundle-checkbox">
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="bundle-item-meta">
                <strong className="bundle-item-name">
                  #{p.seq} {p.produit || 'Sans titre'}
                </strong>
                <div className="bundle-item-prices">
                  <span>Vente: {formatFCFA(p.vente || 0)}</span>
                  <span>·</span>
                  <span className="text-slate-500">Coût: {formatFCFA(p.sourcing || 0)}</span>
                </div>
              </div>
              {isMain && <span className="main-prod-pill">Principal</span>}
            </div>
          );
        })}
      </div>

      {/* Financial Simulator & Settings Bar */}
      <div className="bundle-simulator-footer">
        <div className="bundle-name-input-group">
          <label>Nom de votre Pack Combiné :</label>
          <input
            type="text"
            className="premium-input font-bold"
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
          />
        </div>

        <div className="bundle-kpis-strip">
          <div className="bundle-kpi-item">
            <span className="kpi-lbl">Valeur Normale</span>
            <strong className="kpi-val text-slate-500 line-through">
              {formatFCFA(totalOriginalPrice)}
            </strong>
          </div>

          <div className="bundle-kpi-item">
            <span className="kpi-lbl">Prix du Pack Promo (FCFA)</span>
            <input
              type="number"
              className="bundle-price-input"
              value={activePrice}
              onChange={(e) => setCustomBundlePrice(Number(e.target.value) || 0)}
              title="Ajustez le prix de vente de ce pack"
            />
            {discountPercent > 0 && <span className="bundle-save-pill">-{discountPercent}%</span>}
          </div>

          <div className="bundle-kpi-item">
            <span className="kpi-lbl">Coût Sourcing Total</span>
            <strong className="kpi-val text-slate-700">{formatFCFA(totalCOGS)}</strong>
          </div>

          <div className="bundle-kpi-item highlight">
            <span className="kpi-lbl">Marge Nette en Poche</span>
            <strong className="kpi-val text-emerald-600 font-extrabold">
              +{formatFCFA(netMarginFCFA)}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="btn-apply-bundle-cta"
          onClick={handleApply}
          title="Injecter ce pack multi-produits dans votre page de vente"
        >
          <Store className="w-4 h-4" />
          <span>Appliquer ce Pack Combiné sur ma Landing Page</span>
        </button>
      </div>
    </div>
  );
};
