'use client';

import React from 'react';
import { X, CheckCircle, Store, ArrowRight, Sparkles } from 'lucide-react';
import { OfferStructure } from '../../../types/offerTypes';
import { ProductData } from '../../../types/product';
import { formatFCFA } from '../../../utils/formatters';

interface ApplyOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferStructure | null;
  product: ProductData | null;
  onConfirmApply: () => void;
}

export const ApplyOfferModal: React.FC<ApplyOfferModalProps> = ({
  isOpen,
  onClose,
  offer,
  product,
  onConfirmApply,
}) => {
  if (!isOpen || !offer || !product) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-premium" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div className="settings-modal-top">
          <div className="settings-title-group">
            <div className="settings-header-icon">
              <Store className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="settings-main-title">Appliquer cette Offre</h2>
              <span className="settings-sub-title">Injecter les packs et tarifs dans la Landing Page</span>
            </div>
          </div>
          <button type="button" className="btn-close-settings" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="settings-modal-content">
          <div className="apply-offer-preview-card">
            <h4 className="apply-offer-target-title">
              Produit : <strong>#{product.seq} {product.produit}</strong>
            </h4>
            <div className="apply-offer-structure-name">
              <Sparkles className="w-4 h-4 text-gold-deep inline mr-1" />
              <span>{offer.title}</span>
            </div>

            <p className="apply-offer-desc">
              Les packs de prix suivants vont remplacer les tarifs actuels de votre formulaire de commande COD sur la page de vente :
            </p>

            <div className="apply-tiers-preview">
              {offer.tiers.map((t, idx) => (
                <div key={idx} className="apply-tier-item">
                  <div className="apply-tier-left">
                    <span className="apply-tier-qty">{t.quantity}x</span>
                    <span className="apply-tier-lbl">{t.title}</span>
                  </div>
                  <strong className="apply-tier-price">{formatFCFA(t.salePriceFCFA)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-modal-bottom">
          <button
            type="button"
            className="btn-close-modal-footer"
            onClick={onClose}
            style={{ marginRight: '8px' }}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn-submit-premium-gold"
            onClick={onConfirmApply}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirmer & Ouvrir Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
