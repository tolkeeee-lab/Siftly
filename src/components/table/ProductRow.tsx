'use client';

import React from 'react';
import { ProductData } from '../../types/product';
import { IdentificationCells } from './cells/IdentificationCells';
import { ShippingWidgetCell } from './cells/ShippingWidgetCell';
import { FinancialCells } from './cells/FinancialCells';
import { ScoreCells } from './cells/ScoreCells';
import { MarketingCells } from './cells/MarketingCells';

interface ProductRowProps {
  index: number;
  product: ProductData;
  onUpdate: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  index,
  product,
  onUpdate,
  onOpenBreakEven,
  onDuplicate,
  onDelete,
  onOpenLightbox,
}) => {
  const handleChange = (field: keyof ProductData, value: any) => {
    onUpdate(product.id, field, value);
  };

  return (
    <tr>
      <td className="rownum">{index + 1}</td>
      <IdentificationCells
        product={product}
        onChange={handleChange}
        onOpenLightbox={onOpenLightbox}
      />
      <ShippingWidgetCell product={product} onChange={handleChange} />
      <FinancialCells product={product} onChange={handleChange} />
      <ScoreCells product={product} onChange={handleChange} />
      <MarketingCells
        product={product}
        onChange={handleChange}
        onOpenBreakEven={() => onOpenBreakEven(product)}
        onDuplicate={() => onDuplicate(product.id)}
        onDelete={() => onDelete(product.id)}
      />
    </tr>
  );
};
