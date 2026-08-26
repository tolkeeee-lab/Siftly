'use client';

import React, { useState } from 'react';
import { Sliders, Video, Image, DollarSign, Plus, Trash2, RotateCcw, Upload, ArrowUp, ArrowDown, Move, MessageCircle } from 'lucide-react';
import { LandingPageConfig, LandingOffer, CustomerReview, LandingSectionId } from '../../../types/landingTypes';

const ALL_SECTIONS_META: { id: LandingSectionId; label: string; icon: string; desc: string }[] = [
  { id: 'headline', label: 'Titre & Note Avis ⭐', icon: '📝', desc: 'Titre principal, accroche et étoiles de satisfaction' },
  { id: 'video', label: 'Vidéo Démonstration 🎬', icon: '🎥', desc: 'Lecteur vidéo YouTube, TikTok ou fichier MP4' },
  { id: 'hero_image', label: 'Photo Principale & Prix Promo 🖼️', icon: '📸', desc: 'Image HD du produit et badge de réduction' },
  { id: 'gallery', label: 'Galerie Photos Additionnelles 🖼️', icon: '🗂️', desc: 'Photos complémentaires en carrousel' },
  { id: 'cta_button', label: 'Bouton Commander & Garanties ⚡', icon: '🔥', desc: 'Bouton d’action et badges Livraison 24h' },
  { id: 'benefits', label: 'Avantages & Bénéfices Clés 💡', icon: '✨', desc: 'Liste des points forts avec icônes' },
  { id: 'order_form', label: 'Formulaire de Commande COD 📦', icon: '📝', desc: 'Choix de l’offre et saisie Nom/Téléphone/Ville' },
  { id: 'reviews', label: 'Avis Clients Vérifiés ⭐', icon: '💬', desc: 'Témoignages et notes de clients satisfaits' },
];

const DEFAULT_SECTION_ORDER: LandingSectionId[] = [
  'headline',
  'video',
  'hero_image',
  'gallery',
  'cta_button',
  'benefits',
  'order_form',
  'reviews',
];

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
  const [activeTab, setActiveTab] = useState<'layout' | 'media' | 'text' | 'pricing' | 'reviews'>('layout');

  const updateField = (field: keyof LandingPageConfig, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const currentOrder = config.sectionOrder && config.sectionOrder.length > 0
    ? config.sectionOrder
    : DEFAULT_SECTION_ORDER;

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    updateField('sectionOrder', newOrder);
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
          <h3>Éditeur & Constructeur de Page</h3>
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
          className={`editor-tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          ↕️ Disposition & Ordre
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🎬 Médias
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
          ⭐ Avis ({config.reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="customizer-body">
        {/* Tab 1: Layout & Section Reordering */}
        {activeTab === 'layout' && (
          <div className="editor-group">
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 10px' }}>
              📐 <strong>Organisez l'ordre d'apparition</strong> de chaque bloc (vidéo avant photo, texte au sommet, etc.) en cliquant sur ⬆️ ou ⬇️ :
            </p>
            <div className="section-order-list">
              {currentOrder.map((sectionId, idx) => {
                const meta = ALL_SECTIONS_META.find((m) => m.id === sectionId) || {
                  id: sectionId,
                  label: sectionId,
                  icon: '📌',
                  desc: '',
                };

                return (
                  <div key={sectionId} className="section-order-item">
                    <div className="sec-order-left">
                      <span className="sec-order-num">{idx + 1}</span>
                      <div>
                        <strong className="sec-order-label">{meta.label}</strong>
                        <span className="sec-order-desc">{meta.desc}</span>
                      </div>
                    </div>

                    <div className="sec-order-actions">
                      <button
                        type="button"
                        className="btn-order-move"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        title="Monter ce bloc"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="btn-order-move"
                        disabled={idx === currentOrder.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        title="Descendre ce bloc"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Media */}
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

        {/* Tab 3: Text */}
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

        {/* Tab 4: Pricing */}
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

        {/* Tab 5: Reviews */}
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
