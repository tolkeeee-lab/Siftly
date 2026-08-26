'use client';

import React from 'react';
import { Sparkles, Edit3, Store, Video, ShieldCheck } from 'lucide-react';
import { OfferStructure } from '../../types/offerTypes';
import { formatFCFA } from '../../utils/formatters';

interface OfferStructureCardsProps {
  offers: OfferStructure[];
  onApplyOffer: (offer: OfferStructure) => void;
  onGoToAds: (offer: OfferStructure) => void;
  onEditOffer: (offer: OfferStructure) => void;
}

export const OfferStructureCards: React.FC<OfferStructureCardsProps> = ({
  offers,
  onApplyOffer,
  onGoToAds,
  onEditOffer,
}) => {
  return (
    <div className="offers-grid-container">
      {offers.map((offer) => {
        const isWinner = offer.isRecommendedWinner;

        return (
          <div
            key={offer.id}
            className={`offer-card-item ${isWinner ? 'winner-card' : ''}`}
          >
            {/* Header Badge */}
            <div className="offer-card-top">
              <div className="offer-badge-wrap">
                <span className={`offer-badge-tag ${isWinner ? 'winner-tag' : ''}`}>
                  {offer.badge}
                </span>
                {isWinner && (
                  <span className="recommended-ribbon">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    RECOMMANDÉ POUR PETIT BUDGET
                  </span>
                )}
              </div>
              <div className="offer-title-row">
                <h3 className="offer-title">{offer.title}</h3>
                <button
                  type="button"
                  className="btn-quick-edit-offer"
                  onClick={() => onEditOffer(offer)}
                  title="Modifier les prix et les produits combinés"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier Prix</span>
                </button>
              </div>
              <p className="offer-desc">{offer.description}</p>
            </div>

            {/* Price Tiers List */}
            <div className="offer-tiers-list">
              {offer.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`offer-tier-row ${tier.isFeatured ? 'featured-tier' : ''}`}
                >
                  <div className="tier-info-col">
                    <div className="tier-name-row">
                      <span className="tier-title">{tier.title}</span>
                      {tier.badge && <span className="tier-badge-chip">{tier.badge}</span>}
                    </div>
                    {tier.originalPriceFCFA > tier.salePriceFCFA && (
                      <span className="tier-original-price">
                        {formatFCFA(tier.originalPriceFCFA)}
                      </span>
                    )}
                  </div>
                  <div className="tier-price-col">
                    <strong className="tier-sale-price">{formatFCFA(tier.salePriceFCFA)}</strong>
                    {tier.discountPercent > 0 && (
                      <span className="tier-discount-pill">-{tier.discountPercent}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Advantage */}
            <div className="offer-advantage-box">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{offer.strategicAdvantage}</span>
            </div>

            {/* Financial Metrics Summary */}
            <div className="offer-metrics-grid">
              <div className="metric-box">
                <span className="metric-lbl">Panier Moyen (AOV)</span>
                <strong className="metric-val">{formatFCFA(offer.averageOrderValueFCFA)}</strong>
              </div>

              <div className="metric-box">
                <span className="metric-lbl">Marge Nette / Commande</span>
                <strong className="metric-val text-emerald-600">
                  {formatFCFA(offer.netMarginPerOrderFCFA)}
                </strong>
              </div>

              <div className="metric-box">
                <span className="metric-lbl">Bénéfice Net Projeté</span>
                <strong className="metric-val text-gold-deep">
                  +{formatFCFA(offer.totalNetProfitFCFA)}
                </strong>
              </div>

              <div className="metric-box">
                <span className="metric-lbl">Score Rentabilité</span>
                <strong className="metric-val">
                  {offer.overallRankScore}/100
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="offer-card-actions">
              <button
                type="button"
                className={`btn-apply-offer ${isWinner ? 'btn-winner-cta' : ''}`}
                onClick={() => onApplyOffer(offer)}
                title="Appliquer les prix et packs de cette offre sur la page de vente"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Appliquer sur Landing Page</span>
              </button>

              <button
                type="button"
                className="btn-offer-ads"
                onClick={() => onGoToAds(offer)}
                title="Générer les scripts publicitaires basés sur cette offre"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Scripts Pub</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
