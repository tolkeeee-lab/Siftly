'use client';

import React, { useState } from 'react';
import { X, Plus, Package, Truck, MinusCircle, PlusCircle } from 'lucide-react';
import { ProductData } from '../../../types/product';
import { MovementType } from '../../../types/stockTypes';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  onSaveMovement: (movement: {
    productId: string;
    productName: string;
    type: MovementType;
    quantityChange: number;
    reason: string;
    referenceDoc?: string;
  }) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveMovement,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [type, setType] = useState<MovementType>('po_inflow');
  const [quantity, setQuantity] = useState<number>(50);
  const [reason, setReason] = useState('Réception colis transitaire');
  const [referenceDoc, setReferenceDoc] = useState('PO-2026-001');

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || quantity <= 0) return;

    const delta = (type === 'po_inflow' || type === 'return_in') ? quantity : -quantity;

    onSaveMovement({
      productId: currentProduct.id,
      productName: currentProduct.produit || 'Produit sans nom',
      type,
      quantityChange: delta,
      reason: reason.trim() || 'Mouvement de stock',
      referenceDoc: referenceDoc.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Package className="w-5 h-5 text-gold-deep" />
            <h2>Réception de Stock & Ajustement</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="po-modal-form">
          <div className="po-form-group" style={{ marginBottom: '12px' }}>
            <label className="po-form-label">Article concerné *</label>
            <select
              className="po-select-input"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} - {p.produit || 'Sans nom'}
                </option>
              ))}
            </select>
          </div>

          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Type de mouvement</label>
              <select
                className="po-select-input"
                value={type}
                onChange={(e) => setType(e.target.value as MovementType)}
              >
                <option value="po_inflow">📥 Entrée : Réception Arrivage Chine (PO)</option>
                <option value="return_in">🔄 Entrée : Retour client remis en stock</option>
                <option value="adjustment">⚠️ Sortie : Casse, Perte ou Inventaire</option>
              </select>
            </div>

            <div className="po-form-group flex-1">
              <label className="po-form-label">Quantité (pièces) *</label>
              <input
                type="number"
                min="1"
                required
                className="po-text-input bold text-gold-deep"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Motif / Description</label>
              <input
                type="text"
                className="po-text-input"
                placeholder="ex: Arrivage maritime 50 pcs"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="po-form-group flex-1">
              <label className="po-form-label">N° Réf / Document</label>
              <input
                type="text"
                className="po-text-input"
                placeholder="ex: PO-2026-001"
                value={referenceDoc}
                onChange={(e) => setReferenceDoc(e.target.value)}
              />
            </div>
          </div>

          <div className="po-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-save-po">
              <Plus className="w-4 h-4" />
              <span>Valider le Mouvement de Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
