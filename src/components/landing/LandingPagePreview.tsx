'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Star, ShieldCheck, Truck, Award, ArrowDown, Zap, Clock, MessageCircle, Play } from 'lucide-react';
import { LandingPageConfig, LandingSectionId } from '../../types/landingTypes';
import { CODOrderForm } from './CODOrderForm';
import { formatFCFA } from '../../utils/formatters';

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

interface LandingPagePreviewProps {
  config: LandingPageConfig;
  onOrderSuccess?: (orderData: any) => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  config,
  onOrderSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState('04h 18m 22s');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(23 - now.getHours()).padStart(2, '0');
      const m = String(59 - now.getMinutes()).padStart(2, '0');
      const s = String(59 - now.getSeconds()).padStart(2, '0');
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    document.getElementById('commande-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Video embed helper
  const videoEmbedUrl = useMemo(() => {
    if (!config.videoUrl) return null;
    const url = config.videoUrl.trim();
    if (url.includes('youtube.com/watch?v=')) {
      const vidId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    return url;
  }, [config.videoUrl]);

  // WhatsApp support link
  const whatsappNumberClean = config.whatsappSupportNumber
    ? config.whatsappSupportNumber.replace(/\D/g, '')
    : '';

  const whatsappHref = whatsappNumberClean
    ? `https://wa.me/${whatsappNumberClean}?text=${encodeURIComponent(`Bonjour, j'ai une question sur l'offre *${config.title}*`)}`
    : `https://wa.me/?text=${encodeURIComponent(`Bonjour, j'ai une question sur l'offre *${config.title}*`)}`;

  const activeOrder = config.sectionOrder && config.sectionOrder.length > 0
    ? config.sectionOrder
    : DEFAULT_SECTION_ORDER;

  const renderSection = (sectionId: LandingSectionId) => {
    switch (sectionId) {
      case 'headline':
        return (
          <div key="headline" className="landing-block-headline">
            <div className="hero-rating-pill">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                ))}
              </div>
              <span>4.9 / 5 (+1 840 clients satisfaits)</span>
            </div>
            <h1 className="landing-hero-title">{config.title}</h1>
            <p className="landing-hero-subtitle">{config.subHeadline}</p>
          </div>
        );

      case 'video':
        if (!videoEmbedUrl) return null;
        return (
          <div key="video" className="landing-video-box">
            {videoEmbedUrl.includes('youtube.com') ? (
              <iframe
                src={videoEmbedUrl}
                title={config.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="landing-video-iframe"
              />
            ) : (
              <video controls src={videoEmbedUrl} className="landing-video-element" />
            )}
          </div>
        );

      case 'hero_image':
        return (
          <div key="hero_image" className="landing-hero-img-box">
            {config.heroImage ? (
              <img src={config.heroImage} alt={config.title} />
            ) : (
              <div className="hero-img-placeholder">Photo HD du Produit</div>
            )}
            <div className="hero-price-badge">
              <span className="badge-save">PROMO DU JOUR</span>
              <div className="badge-price">{formatFCFA(config.sellingPriceFCFA)}</div>
              <div className="badge-old-price">{formatFCFA(config.originalPriceFCFA)}</div>
            </div>
          </div>
        );

      case 'gallery':
        if (!config.galleryImages || config.galleryImages.length === 0) return null;
        return (
          <div key="gallery" className="landing-gallery-strip">
            {config.galleryImages.map((img, i) => (
              <div key={i} className="gallery-thumb-item">
                <img src={img} alt={`${config.title} vue ${i + 1}`} />
              </div>
            ))}
          </div>
        );

      case 'cta_button':
        return (
          <div key="cta_button" className="landing-cta-block">
            <div className="stock-countdown-bar">
              <Clock className="w-4 h-4 text-amber-600 inline mr-1" />
              <span>⚠️ Attention : Plus que <strong>6 pièces disponibles</strong> en stock au tarif promo !</span>
            </div>
            <button type="button" className="btn-hero-cta" onClick={scrollToForm}>
              <span>COMMANDER & PAYER À LA LIVRAISON</span>
              <ArrowDown className="w-5 h-5" />
            </button>
            <div className="trust-badges-row">
              <div className="trust-badge-item"><Truck className="w-4 h-4 text-emerald-500" /> Livraison 24h</div>
              <div className="trust-badge-item"><ShieldCheck className="w-4 h-4 text-sky-500" /> Paiement à réception</div>
              <div className="trust-badge-item"><Award className="w-4 h-4 text-amber-500" /> Garantie 7 Jours</div>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div key="benefits" className="landing-section">
            <h2 className="section-title">Ce que vous allez adorer avec cet accessoire :</h2>
            <div className="benefits-list">
              {config.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="benefit-card-item">
                  <div className="benefit-icon"><Zap className="w-4 h-4" /></div>
                  <p className="benefit-text">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'order_form':
        return (
          <CODOrderForm
            key="order_form"
            offers={config.offers}
            productName={config.title}
            productId={config.productId}
            onOrderSuccess={onOrderSuccess}
          />
        );

      case 'reviews':
        return (
          <div key="reviews" className="landing-section">
            <h2 className="section-title">Avis vérifiés de nos clients</h2>
            <div className="reviews-grid">
              {config.reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <div>
                      <strong>{rev.author}</strong>
                      <span className="review-city">{rev.city}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3" style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">« {rev.comment} »</p>
                  <div className="review-date">{rev.date} · Achat vérifié ✅</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="landing-page-root">
      {/* Top Banner Notice with Flash Sale Countdown */}
      <div className="landing-top-announcement">
        <span className="urgency-pulse" />
        <span>🔥 OFFRE FLASH DU JOUR : Se termine dans <strong>{timeLeft}</strong> !</span>
      </div>

      {/* Main Container with Ordered Blocks */}
      <div className="landing-container">
        <div className="landing-hero">
          {activeOrder.map((sectionId) => renderSection(sectionId))}
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <p>© {new Date().getFullYear()} {config.title} · Tous droits réservés.</p>
          <p>Service Client WhatsApp 7j/7 · Paiement sécurisé à la livraison.</p>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="sticky-mobile-cta-bar">
        <div className="sticky-bar-price">
          <span className="sticky-price-label">Prix Spécial</span>
          <span className="sticky-price-num">{formatFCFA(config.sellingPriceFCFA)}</span>
        </div>
        <button type="button" className="btn-sticky-order" onClick={scrollToForm}>
          <span>COMMANDER</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Floating WhatsApp Help Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        title="Besoin d'aide ? Écrivez-nous sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
