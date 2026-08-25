'use client';

import React from 'react';
import { ProductData } from '../../../types/product';
import { calculateCOGS, calculateMargin, calculateMarginPct } from '../../../utils/calculations';
import { formatFCFA, formatPercent, getMarginColorStyle } from '../../../utils/formatters';
import { ShippingWidgetCell } from './ShippingWidgetCell';

interface FinancialCellsProps {
  product: ProductData;
  showCosts?: boolean;
  showResults?: boolean;
  onChange: (field: keyof ProductData, value: any) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
}

export const FinancialCells: React.FC<FinancialCellsProps> = ({
  product,
  showCosts = true,
  showResults = true,
  onChange,
  onOpenCurrencyConverter,
}) => {
  const cogs = calculateCOGS(product);
  const margin = calculateMargin(product);
  const marginPct = calculateMarginPct(product);
  const hasSalePrice = Number(product.vente) > 0;
  const marginStyle = getMarginColorStyle(marginPct, hasSalePrice);

  return (
    <>
      {showCosts && (
        <>
          <td className="num-col">
            <input
              className="cell-in num"
              type="number"
              placeholder="0"
              value={product.concurrent ?? ''}
              onChange={(e) => onChange('concurrent', e.target.value)}
            />
          </td>
          <td className="num-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <input
                className="cell-in num"
                type="number"
                placeholder="0"
                value={product.sourcing ?? ''}
                onChange={(e) => onChange('sourcing', e.target.value)}
              />
              {onOpenCurrencyConverter && (
                <button
                  type="button"
                  className="currency-btn"
                  title="Convertir Yuan (¥) ou Dollar ($) en FCFA"
                  onClick={() => onOpenCurrencyConverter(product.id)}
                >
                  ¥/$
                </button>
              )}
            </div>
          </td>
          <td className="num-col">
            <input
              className="cell-in num"
              type="number"
              step="0.01"
              placeholder="0"
              value={product.poids ?? ''}
              onChange={(e) => onChange('poids', e.target.value)}
            />
          </td>
          <ShippingWidgetCell product={product} onChange={onChange} />
          <td className="num-col">
            <input
              className="cell-in num"
              type="number"
              placeholder="0"
              value={product.cac ?? ''}
              onChange={(e) => onChange('cac', e.target.value)}
            />
          </td>
          <td className="num-col group-end">
            <input
              className="cell-in num"
              type="number"
              placeholder="0"
              value={product.livraison ?? ''}
              onChange={(e) => onChange('livraison', e.target.value)}
            />
          </td>
        </>
      )}

      {showResults && (
        <>
          <td className="num-col group-end computed">{formatFCFA(cogs)}</td>
          <td className="num-col">
            <input
              className="cell-in num"
              type="number"
              placeholder="0"
              value={product.vente ?? ''}
              onChange={(e) => onChange('vente', e.target.value)}
            />
          </td>
          <td className="num-col group-end computed">{formatFCFA(margin)}</td>
          <td className="num-col group-end computed" style={marginStyle}>
            {hasSalePrice ? formatPercent(marginPct) : '—'}
          </td>
        </>
      )}
    </>
  );
};
