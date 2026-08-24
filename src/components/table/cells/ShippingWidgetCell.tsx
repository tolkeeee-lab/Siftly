import React from 'react';
import { ProductData, ImportMode } from '../../../types/product';
import { calculateFreightCost } from '../../../utils/calculations';
import { formatFCFA } from '../../../utils/formatters';

interface ShippingWidgetCellProps {
  product: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
}

export const ShippingWidgetCell: React.FC<ShippingWidgetCellProps> = ({ product, onChange }) => {
  const freightCost = calculateFreightCost(product);

  return (
    <td className="num-col">
      <div className="frais-widget">
        <select
          className="cell-in"
          value={product.modeimport || 'bateau'}
          onChange={(e) => onChange('modeimport', e.target.value as ImportMode)}
        >
          <option value="bateau">Bateau</option>
          <option value="avion">Avion</option>
        </select>
        <div className="frais-rates">
          <div className="rate-group">
            <label>Bateau F/kg</label>
            <input
              className="cell-in"
              type="number"
              placeholder="0"
              value={product.tarifbateau ?? ''}
              onChange={(e) => onChange('tarifbateau', e.target.value)}
            />
          </div>
          <div className="rate-group">
            <label>Avion F/kg</label>
            <input
              className="cell-in"
              type="number"
              placeholder="0"
              value={product.tarifavion ?? ''}
              onChange={(e) => onChange('tarifavion', e.target.value)}
            />
          </div>
        </div>
        <div className="frais-result">{formatFCFA(freightCost)}</div>
      </div>
    </td>
  );
};
