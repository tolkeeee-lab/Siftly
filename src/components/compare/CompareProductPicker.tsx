'use client';

import React from 'react';
import { Plus, X, Package } from 'lucide-react';
import { ProductData } from '../../types/product';

interface CompareProductPickerProps {
  products: ProductData[];
  selectedProductIds: string[];
  onAddSlot: () => void;
  onRemoveSlot: (index: number) => void;
  onChangeProduct: (index: number, productId: string) => void;
}

export const CompareProductPicker: React.FC<CompareProductPickerProps> = ({
  products,
  selectedProductIds,
  onAddSlot,
  onRemoveSlot,
  onChangeProduct,
}) => {
  return (
    <div className="compare-picker-bar">
      <div className="picker-slots-grid">
        {selectedProductIds.map((selectedId, idx) => (
          <div key={idx} className="picker-slot">
            <div className="picker-slot-header">
              <span className="slot-num-tag">Slot #{idx + 1}</span>
              {selectedProductIds.length > 2 && (
                <button
                  type="button"
                  className="btn-remove-slot"
                  title="Retirer cette colonne"
                  onClick={() => onRemoveSlot(idx)}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              className="slot-dropdown"
              value={selectedId}
              onChange={(e) => onChangeProduct(idx, e.target.value)}
            >
              <option value="">-- Choisir un produit --</option>
              {products.map((p, pIdx) => (
                <option key={p.id} value={p.id}>
                  #{pIdx + 1} - {p.produit || 'Sans nom'} ({p.marche || 'Chine'})
                </option>
              ))}
            </select>
          </div>
        ))}

        {selectedProductIds.length < 4 && (
          <button type="button" className="btn-add-slot" onClick={onAddSlot}>
            <Plus className="w-4 h-4" />
            <span>+ Ajouter un 3e ou 4e Produit</span>
          </button>
        )}
      </div>
    </div>
  );
};
