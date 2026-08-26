'use client';

import React, { useState } from 'react';
import { Sliders, Video, Image, DollarSign, Plus, Trash2, RotateCcw, Check, Sparkles, MessageCircle } from 'lucide-react';
import { LandingPageConfig, LandingOffer, CustomerReview } from '../../../types/landingTypes';

interface LandingCustomizerDrawerProps {
  config: LandingPageConfig;
  onChangeConfig: (newConfig: LandingPageConfig) => void;
  onReset: () => void;
}

export const LandingCustomizerDrawer: React.FC<LandingCustomizerDrawerProps> = ({
  config,
  onChangeConfig,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'media' | 'pricing' | 'benefits' | 'reviews'>('text');

  const updateField = (field: keyof LandingPageConfig, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const handleAddBenefit = () => {
    const newBenefits = [...config.keyBenefits, '✅ Nouvel argument percutant'];
    updateField('keyBenefits', newBenefits);
  };

  const handleRemoveBenefit = (idx: number) => {
    const newBenefits = config.keyBenefits.filter((_, i) => i !== idx);
    updateField('keyBenefits', newBenefits);
  };

  const handleUpdateBenefit = (idx: number, text: string) => {
    const newBenefits = [...config.keyBenefits];
    newBenefits[idx] = text;
    updateField('keyBenefits', newBenefits);
  };

  const handleUpdateOffer = (idx: number, field: keyof LandingOffer, value: any) => {
    const newOffers = [...config.offers];
    newOffers[idx] = { ...newOffers[idx], [field]: value };
    updateField('offers', newOffers);
  };

  const handleAddReview = () => {
    const newReview: CustomerReview = {
      id: crypto.randomUUID(),
      author: 'Client Satisfait',
      city: 'Cotonou',
      rating: 5,
      comment: 'Super produit, livraison rapide et conforme à la description !',
      date: 'Hier',
    };
    updateField('reviews', [newReview, ...config.reviews]);
  };

  const handleRemoveReview = (idx: number) => {
    const newReviews = config.reviews.filter((_, i) => i !== idx);
    updateField('reviews', newReviews);
  };

  return (
    <div className="landing-customizer-card">
      <div className="customizer-header">
        <div className="customizer-title">
          <Sliders className="w-4 h-4 text-gold-deep" />
          <h3>Personnaliser la Page de Vente</h3>
        </div>
        <button type="button" className="btn-reset-config" onClick={onReset} title="Rétablir le modèle de base">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Editor Tabs */}
      <div className="customizer-tabs">
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          📝 Textes
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🎬 Vidéos & Photos
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          💵 Packs & Prix
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          ⭐ Avantages ({config.keyBenefits.length})
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          💬 Avis ({config.reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="customizer-body">
        {/* Tab 1: Text */}
        {activeTab === 'text' && (
          <div className="editor-group">
            <label className="editor-label">Titre Principal du Produit</label>
            <input
              type="text"
              className="editor-input"
              value={config.title}
              onChange={(e) => updateField('title', e.target.value)}
            />

            <label className="editor-label">Sous-titre / Accroche de Présentation</label>
            <textarea
              className="editor-textarea"
              rows={3}
              value={config.subHeadline}
              onChange={(e) => updateField('subHeadline', e.target.value)}
            />

            <label className="editor-label">Numéro WhatsApp du Service Client (Pour le bouton d'aide)</label>
            <input
              type="text"
              className="editor-input"
              placeholder="ex: +229 97 00 00 00"
              value={config.whatsappSupportNumber || ''}
              onChange={(e) => updateField('whatsappSupportNumber', e.target.value)}
            />
          </div>
        )}

        {/* Tab 2: Media */}
        {activeTab === 'media' && (
          <div className="editor-group">
            <label className="editor-label">Photo Principale (URL Image HD)</label>
            <input
              type="text"
              className="editor-input"
              placeholder="https://..."
              value={config.heroImage}
              onChange={(e) => updateField('heroImage', e.target.value)}
            />

            <label className="editor-label">Vidéo Produit (Optionnel : Lien YouTube ou MP4)</label>
            <input
              type="text"
              className="editor-input"
              placeholder="ex: https://www.youtube.com/watch?v=... ou .mp4"
              value={config.videoUrl || ''}
              onChange={(e) => updateField('videoUrl', e.target.value)}
            />
            <span style={{ fontSize: '11px', color: '#888' }}>
              💡 Si vous renseignez un lien vidéo, un lecteur vidéo haute définition apparaîtra au-dessus des images !
            </span>
          </div>
        )}

        {/* Tab 3: Pricing */}
        {activeTab === 'pricing' && (
          <div className="editor-group">
            {config.offers.map((offer, idx) => (
              <div key={offer.id} className="editor-offer-box">
                <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                  Formule #{idx + 1} ({offer.name})
                </div>
                <div className="editor-row">
                  <div style={{ flex: 1 }}>
                    <label className="editor-label-sm">Prix Promo (FCFA)</label>
                    <input
                      type="number"
                      className="editor-input-sm"
                      value={offer.priceFCFA}
                      onChange={(e) => handleUpdateOffer(idx, 'priceFCFA', Number(e.target.value) || 0)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="editor-label-sm">Prix Barré (FCFA)</label>
                    <input
                      type="number"
                      className="editor-input-sm"
                      value={offer.originalPriceFCFA}
                      onChange={(e) => handleUpdateOffer(idx, 'originalPriceFCFA', Number(e.target.value) || 0)}
                    />
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <label className="editor-label-sm">Badge Promo</label>
                    <input
                      type="text"
                      className="editor-input-sm"
                      placeholder="ex: -20% POPULAIRE"
                      value={offer.badge || ''}
                      onChange={(e) => handleUpdateOffer(idx, 'badge', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Benefits */}
        {activeTab === 'benefits' && (
          <div className="editor-group">
            {config.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="editor-item-row">
                <input
                  type="text"
                  className="editor-input"
                  value={benefit}
                  onChange={(e) => handleUpdateBenefit(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-del-item"
                  onClick={() => handleRemoveBenefit(idx)}
                  title="Supprimer cet argument"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" className="btn-add-benefit" onClick={handleAddBenefit}>
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un argument</span>
            </button>
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="editor-group">
            {config.reviews.map((rev, idx) => (
              <div key={rev.id} className="editor-review-box">
                <div className="editor-row">
                  <input
                    type="text"
                    className="editor-input-sm"
                    placeholder="Nom du client"
                    value={rev.author}
                    onChange={(e) => {
                      const newRevs = [...config.reviews];
                      newRevs[idx].author = e.target.value;
                      updateField('reviews', newRevs);
                    }}
                  />
                  <input
                    type="text"
                    className="editor-input-sm"
                    placeholder="Ville / Quartier"
                    value={rev.city}
                    onChange={(e) => {
                      const newRevs = [...config.reviews];
                      newRevs[idx].city = e.target.value;
                      updateField('reviews', newRevs);
                    }}
                  />
                  <button
                    type="button"
                    className="btn-del-item"
                    onClick={() => handleRemoveReview(idx)}
                    title="Supprimer cet avis"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  className="editor-textarea-sm"
                  rows={2}
                  value={rev.comment}
                  onChange={(e) => {
                    const newRevs = [...config.reviews];
                    newRevs[idx].comment = e.target.value;
                    updateField('reviews', newRevs);
                  }}
                />
              </div>
            ))}
            <button type="button" className="btn-add-benefit" onClick={handleAddReview}>
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un avis client</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
