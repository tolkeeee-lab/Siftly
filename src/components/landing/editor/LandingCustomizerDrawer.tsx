'use client';

import React, { useState } from 'react';
import { Sliders, Video, Image, DollarSign, Plus, Trash2, RotateCcw, Upload, Sparkles, MessageCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'text' | 'media' | 'pricing' | 'benefits' | 'reviews'>('media');

  const updateField = (field: keyof LandingPageConfig, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isGallery) {
          const current = config.galleryImages || [];
          updateField('galleryImages', [...current, reader.result]);
        } else {
          updateField('heroImage', reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('videoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const current = config.galleryImages || [];
    updateField('galleryImages', current.filter((_, i) => i !== index));
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
          <h3>Éditeur Visuel de Page de Vente</h3>
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
          className={`editor-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🎬 Médias (Photos + Vidéo)
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          📝 Textes
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          💵 Packs & Tarifs
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Avis Clients ({config.reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="customizer-body">
        {/* Tab 1: Media (Photos & Videos) */}
        {activeTab === 'media' && (
          <div className="editor-group">
            {/* Main Photo */}
            <div className="media-upload-section">
              <label className="editor-label font-bold">1. Photo Principale du Produit (HD)</label>
              <div className="media-inputs-row">
                <input
                  type="text"
                  className="editor-input"
                  placeholder="Lien URL de l'image (https://...)"
                  value={config.heroImage}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                />
                <label className="btn-file-upload">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer Image</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, false)} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Video Import */}
            <div className="media-upload-section">
              <label className="editor-label font-bold">2. Vidéo Produit (YouTube, TikTok ou Fichier MP4)</label>
              <div className="media-inputs-row">
                <input
                  type="text"
                  className="editor-input"
                  placeholder="ex: https://www.youtube.com/watch?v=... ou lien MP4"
                  value={config.videoUrl || ''}
                  onChange={(e) => updateField('videoUrl', e.target.value)}
                />
                <label className="btn-file-upload">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer Vidéo</span>
                  <input type="file" accept="video/*" onChange={handleVideoFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <span className="media-hint-text">
                💡 Vous pouvez afficher la vidéo de démo en haut ET vos photos en dessous en même temps !
              </span>
            </div>

            {/* Gallery Images */}
            <div className="media-upload-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="editor-label font-bold">3. Photos Complémentaires (Galerie)</label>
                <label className="btn-file-upload mini">
                  <Plus className="w-3 h-3" />
                  <span>Ajouter Photo</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, true)} style={{ display: 'none' }} />
                </label>
              </div>
              {config.galleryImages && config.galleryImages.length > 0 && (
                <div className="gallery-previews-grid">
                  {config.galleryImages.map((img, i) => (
                    <div key={i} className="gallery-thumb-preview">
                      <img src={img} alt={`Thumb ${i}`} />
                      <button type="button" className="btn-del-thumb" onClick={() => handleRemoveGalleryImage(i)}>
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Text */}
        {activeTab === 'text' && (
          <div className="editor-group">
            <label className="editor-label">Titre Vendeur du Produit</label>
            <input
              type="text"
              className="editor-input font-bold"
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

            <label className="editor-label">Numéro WhatsApp du Service Client (Bouton d'aide)</label>
            <input
              type="text"
              className="editor-input"
              placeholder="ex: +229 97 00 00 00"
              value={config.whatsappSupportNumber || ''}
              onChange={(e) => updateField('whatsappSupportNumber', e.target.value)}
            />
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="editor-group">
            <button type="button" className="btn-add-benefit" onClick={handleAddReview}>
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un Avis Client Récent</span>
            </button>
            {config.reviews.map((rev, idx) => (
              <div key={rev.id} className="editor-review-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '12px' }}>{rev.author} ({rev.city})</strong>
                  <button type="button" className="rowdel" onClick={() => handleRemoveReview(idx)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
                <p style={{ fontSize: '11.5px', color: '#555', margin: '4px 0 0' }}>"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
