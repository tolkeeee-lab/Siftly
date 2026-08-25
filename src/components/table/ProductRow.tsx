'use client';

import React from 'react';
import { ProductData } from '../../types/product';
import { VisibleColumnGroups } from '../../types/tableFeatures';
import { IdentificationCells } from './cells/IdentificationCells';
import { FinancialCells } from './cells/FinancialCells';
import { ScoreCells } from './cells/ScoreCells';
import { MarketingCells } from './cells/MarketingCells';

interface ProductRowProps {
  index: number;
  product: ProductData;
  isRankingActive?: boolean;
  visibleGroups: VisibleColumnGroups;
  onUpdate: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onOpenOnePager?: (product: ProductData, rankIndex: number) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  index,
  product,
  isRankingActive = true,
  visibleGroups,
  onUpdate,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenCurrencyConverter,
  onDuplicate,
  onDelete,
  onOpenLightbox,
}) => {
  const handleChange = (field: keyof ProductData, value: any) => {
    onUpdate(product.id, field, value);
  };

  const renderRankBadge = () => {
    if (!isRankingActive) return index + 1;
    if (index === 0) return <span style={{ color: '#D4AF37', fontWeight: 600 }} title="Produit #1 Gagnant">🥇 1</span>;
    if (index === 1) return <span style={{ color: '#C0C0C0', fontWeight: 600 }} title="Produit #2">🥈 2</span>;
    if (index === 2) return <span style={{ color: '#CD7F32', fontWeight: 600 }} title="Produit #3">🥉 3</span>;
    return index + 1;
  };

  return (
    <tr className={isRankingActive && index === 0 ? 'top-winner-row' : ''}>
      <td className="rownum">{renderRankBadge()}</td>
      <IdentificationCells
        product={product}
        showLinks={visibleGroups.identification}
        onChange={handleChange}
        onOpenLightbox={onOpenLightbox}
      />
      <FinancialCells
        product={product}
        showCosts={visibleGroups.costs}
        showResults={visibleGroups.results}
        onChange={handleChange}
        onOpenCurrencyConverter={onOpenCurrencyConverter}
      />
      <ScoreCells
        product={product}
        showScoring={visibleGroups.scoring}
        onChange={handleChange}
      />
      <MarketingCells
        product={product}
        showMarketing={visibleGroups.marketing}
        onChange={handleChange}
        onOpenBreakEven={() => onOpenBreakEven(product)}
        onOpenOnePager={onOpenOnePager ? () => onOpenOnePager(product, index) : undefined}
        onDuplicate={() => onDuplicate(product.id)}
        onDelete={() => onDelete(product.id)}
      />
    </tr>
  );
};
