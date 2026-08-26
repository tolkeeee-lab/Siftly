'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Package, DollarSign, Sparkles, Plus, Trash2 } from 'lucide-react';
import { OfferStructure, OfferTier } from '../../../types/offerTypes';
import { ProductData } from '../../../types/product';
import { formatFCFA } from '../../../utils/formatters';

interface EditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferStructure | null;
  products: ProductData[];
  selectedBundleProductId: string;
  onSelectBundleProduct: (id: string) => void;
  onSaveCustomTiers: (offerId: string, customTiers: OfferTier[]) => void;
}

export const EditOfferModal: React.FC<EditOfferModalProps> = ({
  isOpen,
  onClose,
  offer,
  products,
  selectedBundleProductId,
  onSelectBundleProduct,
  onSaveCustomTiers,
}) => {
  const [tiers, setTiers] = useState<OfferTier[]>([]);

  useEffect(() => {
    if (offer) {
      setTiers(JSON.parse(JSON.stringify(offer.tiers)));
    }
  }, [offer]);

  if (!isOpen || !offer) return null;

  const handleTierChange = (index: number, field: keyof OfferTier, value: any) => {
    const next = [...tiers];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    if (field === 'salePriceFCFA' || field === 'originalPriceFCFA') {
      const orig = field === 'originalPriceFCFA' ? Number(value) : next[index].originalPriceFCFA;
      const sale = field === 'salePriceFCFA' ? Number(value) : next[index].salePriceFCFA;
      if (orig > sale && orig > 0) {
        next[index].discountPercent = Math.round(((orig - sale) / orig) * 100);
      } else {
        next[index].discountPercent = 0;
      }
    }
    setTiers(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomTiers(offer.id, tiers);
    onClose();
  };

  const isBundle = offer.type === 'bundle_cross_sell';

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-premium" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="settings-modal-top">
          <div className="settings-title-group">
            <div className="settings-header-icon">
              <Edit3 className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="settings-main-title">Personnaliser l'Offre & Tarifs</h2>
              <span className="settings-sub-title">{offer.title}</span>
            </div>
          </div>
          <button type="button" className="btn-close-settings" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="settings-modal-content">
            {/* If Cross-Sell Bundle: Select the 2nd Product */}
            {isBundle && (
              <div className="bundle-product-picker-card">
                <label className="bundle-picker-label">
                  <Package className="w-4 h-4 text-emerald-600 inline mr-1" />
                  Choisir le 2ème Produit à Vendre en Combiné (Bundle 2-en-1) :
                </label>
                <select
                  className="bundle-select-input"
                  value={selectedBundleProductId}
                  onChange={(e) => onSelectBundleProduct(e.target.value)}
                >
                  <option value="">-- Sélectionner un produit complémentaire --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.seq} {p.produit} (Vente: {formatFCFA(p.vente || 0)} · Sourcing: {formatFCFA(p.sourcing || 0)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Editable Tiers List */}
            <div className="edit-tiers-section">
              <h4 className="edit-tiers-heading">Paliers de Prix & Réductions Modifiables :</h4>
              <div className="edit-tiers-stack">
                {tiers.map((tier, idx) => (
                  <div key={idx} className="edit-tier-card">
                    <div className="edit-tier-row-1">
                      <div className="edit-field-group" style={{ flex: 2 }}>
                        <label>Nom du Pack #{idx + 1}</label>
                        <input
                          type="text"
                          className="premium-input"
                          value={tier.title}
                          onChange={(e) => handleTierChange(idx, 'title', e.target.value)}
                          required
                        />
                      </div>
                      <div className="edit-field-group" style={{ width: '80px' }}>
                        <label>Qté (pcs)</label>
                        <input
                          type="number"
                          className="premium-input text-center"
                          value={tier.quantity}
                          onChange={(e) => handleTierChange(idx, 'quantity', Number(e.target.value) || 1)}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="edit-tier-row-2">
                      <div className="edit-field-group">
                        <label>Prix de Vente Promo (FCFA) *</label>
                        <input
                          type="number"
                          className="premium-input font-bold"
                          value={tier.salePriceFCFA}
                          onChange={(e) => handleTierChange(idx, 'salePriceFCFA', Number(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="edit-field-group">
                        <label>Prix Barré / Normal (FCFA)</label>
                        <input
                          type="number"
                          className="premium-input"
                          value={tier.originalPriceFCFA}
                          onChange={(e) => handleTierChange(idx, 'originalPriceFCFA', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div className="edit-field-group">
                        <label>Badge Promo</label>
                        <input
                          type="text"
                          className="premium-input"
                          placeholder="ex: 🔥 Populaire"
                          value={tier.badge || ''}
                          onChange={(e) => handleTierChange(idx, 'badge', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="settings-modal-bottom">
            <button type="button" className="btn-close-modal-footer" onClick={onClose} style={{ marginRight: '8px' }}>
              Annuler
            </button>
            <button type="submit" className="btn-submit-premium-gold">
              <Check className="w-4 h-4" />
              <span>Enregistrer Mes Tarifs</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
