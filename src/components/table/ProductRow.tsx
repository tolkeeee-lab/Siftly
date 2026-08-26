'use client';

import React from 'react';
import { ProductData } from '../../types/product';
import { IdentificationCells } from './cells/IdentificationCells';
import { FinancialCells } from './cells/FinancialCells';
import { ScoreCells } from './cells/ScoreCells';
import { MarketingCells } from './cells/MarketingCells';

interface ProductRowProps {
  product: ProductData;
  index: number;
  isRankingActive?: boolean;
  visibleGroups: {
    identification: boolean;
    costs: boolean;
    results: boolean;
    scoring: boolean;
    marketing: boolean;
  };
  onUpdate: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onOpenOnePager?: (product: ProductData, rankIndex: number) => void;
  onOpenMarketAnalysis?: (product: ProductData) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  index,
  isRankingActive = true,
  visibleGroups,
  onUpdate,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenMarketAnalysis,
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
    if (index === 0) return '🏆 1';
    if (index === 1) return '🥈 2';
    if (index === 2) return '🥉 3';
    return `#${index + 1}`;
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
        onOpenMarketAnalysis={onOpenMarketAnalysis ? () => onOpenMarketAnalysis(product) : undefined}
        onDuplicate={() => onDuplicate(product.id)}
        onDelete={() => onDelete(product.id)}
      />
    </tr>
  );
};
