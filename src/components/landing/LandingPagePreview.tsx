'use client';

import React from 'react';
import { Star, ShieldCheck, Truck, Clock, Award, ArrowDown } from 'lucide-react';
import { LandingPageConfig } from '../../types/landingTypes';
import { CODOrderForm } from './CODOrderForm';
import { formatFCFA } from '../../utils/formatters';

interface LandingPagePreviewProps {
  config: LandingPageConfig;
  onOrderSuccess?: (orderData: any) => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  config,
  onOrderSuccess,
}) => {
  const scrollToForm = () => {
    document.getElementById('commande-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page-root">
      {/* Top Banner Notice */}
      <div className="landing-top-announcement">
        🔥 OFFRE SPÉCIALE AUJOURD'HUI : LIVRAISON RAPIDE & PAIEMENT À LA RÉCEPTION DU COLIS !
      </div>

      {/* Main Container */}
      <div className="landing-container">
        {/* Hero Section */}
        <div className="landing-hero">
          <div className="hero-rating-pill">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>+2 500 Clients Satisfaits</span>
          </div>

          <h1 className="landing-hero-title">{config.title}</h1>
          <p className="landing-hero-subtitle">{config.subHeadline}</p>

          {/* Hero Image */}
          <div className="landing-hero-img-box">
            {config.heroImage ? (
              <img src={config.heroImage} alt={config.title} />
            ) : (
              <div className="hero-img-placeholder">Photo HD du Produit</div>
            )}
            <div className="hero-price-badge">
              <span className="badge-save">PROMO -33%</span>
              <div className="badge-price">{formatFCFA(config.sellingPriceFCFA)}</div>
              <div className="badge-old-price">{formatFCFA(config.originalPriceFCFA)}</div>
            </div>
          </div>

          <button type="button" className="btn-hero-cta" onClick={scrollToForm}>
            <span>COMMANDER MAINTENANT & PAYER À LA LIVRAISON</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <div className="trust-badges-row">
            <div className="trust-badge-item"><Truck className="w-4 h-4 text-emerald-400" /> Livraison 24h/48h</div>
            <div className="trust-badge-item"><ShieldCheck className="w-4 h-4 text-sky-400" /> Paiement à la réception</div>
            <div className="trust-badge-item"><Award className="w-4 h-4 text-amber-400" /> Garantie 7 Jours</div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="landing-section benefits-card">
          <h2 className="section-title">Pourquoi tout le monde s'arrache cet accessoire ?</h2>
          <div className="benefits-list">
            {config.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="benefit-item">
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Order Form */}
        <CODOrderForm
          offers={config.offers}
          productName={config.title}
          productId={config.productId}
          onOrderSuccess={onOrderSuccess}
        />

        {/* Customer Reviews Section */}
        <div className="landing-section reviews-section">
          <h2 className="section-title">Avis de nos clients vérifiés</h2>
          <div className="reviews-grid">
            {config.reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-header">
                  <div className="review-author-info">
                    <strong>{rev.author}</strong>
                    <span className="review-city">{rev.city}</span>
                  </div>
                  <div className="review-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="review-comment">« {rev.comment} »</p>
                <div className="review-date">{rev.date} · Achat vérifié ✅</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <p>© {new Date().getFullYear()} {config.title} · Tous droits réservés.</p>
          <p>Service Client WhatsApp 7j/7 · Paiement sécurisé à la livraison.</p>
        </div>
      </div>
    </div>
  );
};
