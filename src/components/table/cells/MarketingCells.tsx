'use client';

import React from 'react';
import { X, Copy } from 'lucide-react';
import { ProductData } from '../../../types/product';

interface MarketingCellsProps {
  product: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const MarketingCells: React.FC<MarketingCellsProps> = ({
  product,
  onChange,
  onDuplicate,
  onDelete,
}) => {
  return (
    <>
      <td>
        <input
          className="cell-in"
          type="text"
          placeholder="Cible"
          value={product.cible || ''}
          onChange={(e) => onChange('cible', e.target.value)}
        />
      </td>
      <td>
        <input
          className="cell-in wide"
          type="text"
          placeholder="Angle d'attaque"
          value={product.angle || ''}
          onChange={(e) => onChange('angle', e.target.value)}
        />
      </td>
      <td>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            className="rowdel"
            type="button"
            title="Dupliquer la fiche"
            onClick={onDuplicate}
          >
            <Copy className="w-3 h-3 text-gold-deep" />
          </button>
          <button
            className="rowdel"
            type="button"
            title="Supprimer la ligne"
            onClick={onDelete}
          >
            <X className="w-3 h-3 text-red-700" />
          </button>
        </div>
      </td>
    </>
  );
};
