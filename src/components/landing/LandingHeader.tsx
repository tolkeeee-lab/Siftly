'use client';

import React from 'react';
import { Store, Share2, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import { ProductData } from '../../types/product';

interface LandingHeaderProps {
  products: ProductData[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  previewMode: 'mobile' | 'full';
  onTogglePreviewMode: (mode: 'mobile' | 'full') => void;
  onOpenShareModal: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  previewMode,
  onTogglePreviewMode,
  onOpenShareModal,
}) => {
  return (
    <div className="landing-builder-header">
      <div className="builder-header-top">
        <div>
          <h1 className="builder-title">🏪 Générateur de Pages de Vente & Formulaire COD</h1>
          <p className="builder-subtitle">
            Générez des pages mono-produit ultra-rapides sur smartphone pour convertir vos visiteurs TikTok/Facebook en commandes réelles.
          </p>
        </div>

        <div className="builder-top-actions">
          {/* Viewport switch */}
          <div className="viewport-toggle-pills">
            <button
              type="button"
              className={`viewport-btn ${previewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => onTogglePreviewMode('mobile')}
              title="Aperçu Écran Smartphone (iPhone / Android)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
            <button
              type="button"
              className={`viewport-btn ${previewMode === 'full' ? 'active' : ''}`}
              onClick={() => onTogglePreviewMode('full')}
              title="Aperçu Plein Écran"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Large</span>
            </button>
          </div>

          <button type="button" className="btn-share-landing" onClick={onOpenShareModal}>
            <Share2 className="w-4 h-4" />
            <span>Lien Public pour Vos Publicités</span>
          </button>
        </div>
      </div>

      {/* Product Selector */}
      <div className="builder-selector-card">
        <div className="selector-inner">
          <Store className="w-4 h-4 text-gold-deep" />
          <span style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono', color: 'rgba(247, 242, 228, 0.8)' }}>
            Produit sélectionné :
          </span>
          <select
            className="builder-dropdown"
            value={selectedProductId}
            onChange={(e) => onSelectProduct(e.target.value)}
          >
            {products.map((p, idx) => (
              <option key={p.id} value={p.id}>
                #{idx + 1} - {p.produit || 'Produit sans nom'} (Prix : {p.vente || '0'} FCFA)
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
