'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, Phone, MapPin, User, ArrowRight } from 'lucide-react';
import { LandingOffer } from '../../types/landingTypes';
import { formatFCFA } from '../../utils/formatters';

interface CODOrderFormProps {
  offers: LandingOffer[];
  productName: string;
  productId?: string;
  onOrderSuccess?: (orderData: {
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
    quantity: number;
    totalPriceFCFA: number;
    productName: string;
    productId?: string;
  }) => void;
}

export const CODOrderForm: React.FC<CODOrderFormProps> = ({
  offers,
  productName,
  productId,
  onOrderSuccess,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    offers.find((o) => o.isRecommended)?.id || offers[0]?.id || ''
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Cotonou');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;

    if (onOrderSuccess && currentOffer) {
      onOrderSuccess({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity.trim(),
        customerAddress: customerAddress.trim(),
        quantity: currentOffer.quantity,
        totalPriceFCFA: currentOffer.priceFCFA,
        productName,
        productId,
      });
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="cod-order-success-card">
        <div className="success-icon-wrap">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h3 className="success-title">🎉 Félicitations ! Votre commande est validée</h3>
        <p className="success-desc">
          Merci <strong>{customerName}</strong>. Notre service client va vous contacter au <strong>{customerPhone}</strong> pour confirmer l'heure de passage de votre livreur à <strong>{customerCity}</strong>.
        </p>
        <div className="success-recap-box">
          <div>📦 Article : <strong>{productName} (x{currentOffer?.quantity})</strong></div>
          <div>💵 Montant à payer au livreur : <strong className="text-gold-deep">{formatFCFA(currentOffer?.priceFCFA || 0)}</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div id="commande-form" className="cod-order-form-container">
      <div className="form-header">
        <div className="form-header-badge">
          <Truck className="w-4 h-4" />
          <span>PAIEMENT À LA LIVRAISON (CASH ON DELIVERY)</span>
        </div>
        <h3 className="form-title">Remplissez le formulaire pour recevoir votre colis</h3>
        <p className="form-subtitle">Livraison express en 24h/48h chez vous ou au bureau</p>
      </div>

      <form onSubmit={handleSubmit} className="landing-checkout-form">
        {/* Step 1: Pack Selection */}
        <div className="form-step-section">
          <label className="step-label">Étape 1 : Choisissez votre formule avantageuse</label>
          <div className="offers-picker-grid">
            {offers.map((offer) => {
              const isSelected = selectedOfferId === offer.id;
              return (
                <div
                  key={offer.id}
                  className={`offer-selection-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedOfferId(offer.id)}
                >
                  {offer.badge && <span className="offer-tag-badge">{offer.badge}</span>}
                  <div className="offer-card-top">
                    <input
                      type="radio"
                      name="offer"
                      checked={isSelected}
                      onChange={() => setSelectedOfferId(offer.id)}
                    />
                    <strong className="offer-card-name">{offer.name}</strong>
                  </div>
                  <div className="offer-prices">
                    <span className="price-current">{formatFCFA(offer.priceFCFA)}</span>
                    <span className="price-old">{formatFCFA(offer.originalPriceFCFA)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Customer Details */}
        <div className="form-step-section">
          <label className="step-label">Étape 2 : Vos coordonnées pour la livraison</label>

          <div className="form-input-group">
            <label><User className="w-3.5 h-3.5 inline mr-1" /> Nom & Prénom *</label>
            <input
              type="text"
              required
              className="landing-input"
              placeholder="ex: Jean DOSSOU"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-input-group">
            <label><Phone className="w-3.5 h-3.5 inline mr-1" /> Numéro Téléphone WhatsApp (Actif) *</label>
            <input
              type="tel"
              required
              className="landing-input bold"
              placeholder="ex: 97 00 00 00"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="form-input-row">
            <div className="form-input-group flex-1">
              <label>Ville *</label>
              <input
                type="text"
                required
                className="landing-input"
                placeholder="ex: Cotonou / Abidjan"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
              />
            </div>

            <div className="form-input-group flex-2">
              <label><MapPin className="w-3.5 h-3.5 inline mr-1" /> Quartier & Repère *</label>
              <input
                type="text"
                required
                className="landing-input"
                placeholder="ex: Akpakpa, vers le carrefour"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Total & Submit Button */}
        <div className="checkout-summary-box">
          <div className="summary-line">
            <span>Total à payer au livreur :</span>
            <strong className="summary-price">{formatFCFA(currentOffer?.priceFCFA || 0)}</strong>
          </div>

          <button type="submit" className="btn-submit-cod-order">
            <span>COMMANDER ET PAYER À LA LIVRAISON</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="guarantee-security-line">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
            <span>Paiement 100% sécurisé à la réception après inspection de votre colis</span>
          </div>
        </div>
      </form>
    </div>
  );
};
