'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Truck, User, MapPin, DollarSign, Package } from 'lucide-react';
import { CODOrder, CODStatus, Livreur } from '../../../types/codLogistics';
import { ProductData } from '../../../types/product';

interface CreateCODOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  livreurs: Livreur[];
  onSaveOrder: (orderData: Omit<CODOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => void;
}

export const CreateCODOrderModal: React.FC<CreateCODOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  livreurs,
  onSaveOrder,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(15000);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Cotonou');
  const [customerAddress, setCustomerAddress] = useState('');
  
  const [livreurId, setLivreurId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Auto-fill price and name when product selected
  useEffect(() => {
    if (selectedProductId) {
      const p = products.find((prod) => prod.id === selectedProductId);
      if (p) {
        setProductName(p.produit || '');
        setUnitPrice(Number(p.vente) || 15000);
      }
    }
  }, [selectedProductId, products]);

  if (!isOpen) return null;

  const totalPriceFCFA = quantity * unitPrice;
  const assignedLivreur = livreurs.find((l) => l.id === livreurId);
  const deliveryFee = assignedLivreur ? assignedLivreur.deliveryFee : 1500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !productName.trim()) return;

    onSaveOrder({
      productId: selectedProductId || undefined,
      productName: productName.trim(),
      quantity,
      totalPriceFCFA,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity: customerCity.trim(),
      customerAddress: customerAddress.trim() || 'Adresse à confirmer',
      livreurId: assignedLivreur?.id || undefined,
      livreurName: assignedLivreur?.name || undefined,
      deliveryFeeFCFA: deliveryFee,
      status: 'to_confirm' as CODStatus,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Truck className="w-5 h-5 text-gold-deep" />
            <h2>Nouvelle Commande Client (COD)</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="po-modal-form">
          {/* Section 1: Produit & Prix */}
          <div className="po-form-section">
            <label className="po-form-label">Importer depuis vos produits Siftly :</label>
            <select
              className="po-select-input"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Choisir un produit Siftly (Optionnel) --</option>
              {products.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} - {p.produit || 'Produit sans nom'} (Prix : {p.vente || '0'} FCFA)
                </option>
              ))}
            </select>
          </div>

          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Nom de l'article *</label>
              <input
                className="po-text-input"
                type="text"
                required
                placeholder="ex: Lampe Anti-Moustique"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="po-form-group">
              <label className="po-form-label">Prix unitaire (FCFA)</label>
              <input
                className="po-text-input bold"
                type="number"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="po-form-group">
              <label className="po-form-label">Quantité</label>
              <input
                className="po-text-input bold"
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Section 2: Client & Contact */}
          <div className="po-form-card gold">
            <div className="po-card-subhead">
              <User className="w-4 h-4 text-gold-deep" />
              <span>Coordonnées du Client</span>
            </div>

            <div className="po-form-row">
              <div className="po-form-group flex-2">
                <label className="po-form-label">Nom complet du client *</label>
                <input
                  className="po-text-input"
                  type="text"
                  required
                  placeholder="ex: M. Koffi MENSAH"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="po-form-group flex-2">
                <label className="po-form-label">Téléphone / WhatsApp *</label>
                <input
                  className="po-text-input bold"
                  type="tel"
                  required
                  placeholder="ex: +229 97 00 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="po-form-row">
              <div className="po-form-group">
                <label className="po-form-label">Ville</label>
                <input
                  className="po-text-input"
                  type="text"
                  placeholder="ex: Cotonou / Abidjan"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                />
              </div>

              <div className="po-form-group flex-2">
                <label className="po-form-label">Adresse / Quartier / Repère</label>
                <input
                  className="po-text-input"
                  type="text"
                  placeholder="ex: Haie Vive, en face de la pharmacie"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Livreur & Notes */}
          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Assigner un livreur (Optionnel)</label>
              <select
                className="po-select-input"
                value={livreurId}
                onChange={(e) => setLivreurId(e.target.value)}
              >
                <option value="">-- Assigner plus tard --</option>
                {livreurs.map((liv) => (
                  <option key={liv.id} value={liv.id}>
                    {liv.name} ({liv.zone}) - {liv.deliveryFee} FCFA
                  </option>
                ))}
              </select>
            </div>

            <div className="po-form-group flex-2">
              <label className="po-form-label">Instructions particulières</label>
              <input
                className="po-text-input"
                type="text"
                placeholder="ex: Appeler avant 14h"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="po-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-save-po">
              <Plus className="w-4 h-4" />
              <span>Enregistrer la Commande ({totalPriceFCFA.toLocaleString()} FCFA)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
