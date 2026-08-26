'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, Phone, MapPin, User, ArrowRight, Lock } from 'lucide-react';
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
          <CheckCircle2 className="w-14 h-14 text-emerald-500" />
        </div>
        <h3 className="success-title">🎉 Votre commande est confirmée !</h3>
        <p className="success-desc">
          Merci <strong>{customerName}</strong>. Notre service logistique va vous appeler au <strong>{customerPhone}</strong> pour planifier la livraison à <strong>{customerCity}</strong>.
        </p>
        <div className="success-recap-box">
          <div>📦 Produit : <strong>{productName} (x{currentOffer?.quantity})</strong></div>
          <div>💵 Montant à régler à la livraison : <strong style={{ color: '#059669', fontSize: '15px' }}>{formatFCFA(currentOffer?.priceFCFA || 0)}</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div id="commande-form" className="cod-order-form-container">
      <div className="form-top-ribbon">
        <Truck className="w-3.5 h-3.5 inline mr-1" /> PAIEMENT CASH À LA LIVRAISON
      </div>

      <div className="form-header">
        <h3 className="form-title">Passez votre commande en 10 secondes</h3>
        <p className="form-subtitle">Ne payez rien maintenant. Payez au livreur après réception !</p>
      </div>

      <form onSubmit={handleSubmit} className="landing-checkout-form">
        {/* Step 1: Pack Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label className="step-label">
            <span className="step-badge">1</span>
            <span>Choisissez votre formule</span>
          </label>

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
                      className="offer-radio"
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
        <div style={{ marginBottom: '16px' }}>
          <label className="step-label">
            <span className="step-badge">2</span>
            <span>Adresse de livraison</span>
          </label>

          <div className="form-input-group">
            <label><User className="w-3.5 h-3.5 inline mr-1" /> Votre Nom Complet *</label>
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
            <label><Phone className="w-3.5 h-3.5 inline mr-1" /> Numéro WhatsApp (Appel de livraison) *</label>
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
            <div className="form-input-group" style={{ flex: 1 }}>
              <label>Ville *</label>
              <input
                type="text"
                required
                className="landing-input"
                placeholder="Cotonou / Abidjan"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
              />
            </div>

            <div className="form-input-group" style={{ flex: 1.5 }}>
              <label><MapPin className="w-3.5 h-3.5 inline mr-1" /> Quartier & Repère *</label>
              <input
                type="text"
                required
                className="landing-input"
                placeholder="ex: Akpakpa, vers l'église"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Total & Submit Button */}
        <div className="checkout-summary-box">
          <div className="summary-line">
            <span>Montant à régler au livreur :</span>
            <strong className="summary-price">{formatFCFA(currentOffer?.priceFCFA || 0)}</strong>
          </div>

          <button type="submit" className="btn-submit-cod-order">
            <span>COMMANDER & PAYER À LA LIVRAISON</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="guarantee-security-line">
            <Lock className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            <span>Colis vérifié avant paiement · Garantie 7 jours incluse</span>
          </div>
        </div>
      </form>
    </div>
  );
};
