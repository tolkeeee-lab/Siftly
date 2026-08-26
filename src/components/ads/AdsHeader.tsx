'use client';

import React from 'react';
import { Video, Sparkles, FileText, Package } from 'lucide-react';
import { ProductData } from '../../types/product';

interface AdsHeaderProps {
  products: ProductData[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onOpenExportBrief: () => void;
}

export const AdsHeader: React.FC<AdsHeaderProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  onOpenExportBrief,
}) => {
  return (
    <div className="ads-header-wrap">
      <div className="ads-header-top">
        <div>
          <h1 className="ads-title">🎬 Ads Studio & Launchpad Publicitaire</h1>
          <p className="ads-subtitle">
            Générez des scripts vidéos viraux (TikTok / Reels / FB), calculez votre CPA cible et préparez vos briefs créatifs en 1 clic.
          </p>
        </div>

        <button type="button" className="btn-export-brief" onClick={onOpenExportBrief}>
          <FileText className="w-4 h-4" />
          <span>Exporter le Brief Vidéo (PDF / WhatsApp)</span>
        </button>
      </div>

      {/* Product Selector Bar */}
      <div className="ads-product-selector-card">
        <div className="ads-selector-left">
          <Package className="w-4 h-4 text-gold-deep" />
          <span className="ads-selector-lbl">Produit analysé :</span>
          <select
            className="ads-product-dropdown"
            value={selectedProductId}
            onChange={(e) => onSelectProduct(e.target.value)}
          >
            {products.map((p, idx) => (
              <option key={p.id} value={p.id}>
                #{idx + 1} - {p.produit || 'Produit sans nom'} (Vente : {p.vente || '0'} FCFA)
              </option>
            ))}
          </select>
        </div>

        <div className="ads-selector-badge">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Scripts & Métriques générés en direct</span>
        </div>
      </div>
    </div>
  );
};
