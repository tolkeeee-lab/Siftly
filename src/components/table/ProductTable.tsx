'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ProductData } from '../../types/product';
import { SortConfig, SortFieldKey, VisibleColumnGroups } from '../../types/tableFeatures';
import { TableHeader } from './TableHeader';
import { ProductRow } from './ProductRow';

interface ProductTableProps {
  products: ProductData[];
  isRankingActive?: boolean;
  visibleGroups: VisibleColumnGroups;
  sortConfig: SortConfig | null;
  onToggleSort: (key: SortFieldKey) => void;
  onUpdateProduct: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onOpenOnePager: (product: ProductData, rankIndex: number) => void;
  onOpenMarketAnalysis?: (product: ProductData) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
  onDuplicateProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isRankingActive = true,
  visibleGroups,
  sortConfig,
  onToggleSort,
  onUpdateProduct,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenMarketAnalysis,
  onOpenCurrencyConverter,
  onDuplicateProduct,
  onDeleteProduct,
  onAddProduct,
  onOpenLightbox,
}) => {
  return (
    <div className="panel table-wrap">
      <table className="eval-table">
        <TableHeader
          visibleGroups={visibleGroups}
          sortConfig={sortConfig}
          onToggleSort={onToggleSort}
        />
        <tbody>
          {products.map((p, index) => (
            <ProductRow
              key={p.id}
              index={index}
              product={p}
              isRankingActive={isRankingActive}
              visibleGroups={visibleGroups}
              onUpdate={onUpdateProduct}
              onOpenBreakEven={onOpenBreakEven}
              onOpenOnePager={onOpenOnePager}
              onOpenMarketAnalysis={onOpenMarketAnalysis}
              onOpenCurrencyConverter={onOpenCurrencyConverter}
              onDuplicate={onDuplicateProduct}
              onDelete={onDeleteProduct}
              onOpenLightbox={onOpenLightbox}
            />
          ))}
        </tbody>
      </table>
      <div className="addrow-wrap">
        <button className="addrow" type="button" onClick={onAddProduct}>
          <Plus className="w-3.5 h-3.5" />
          Ajouter un produit
        </button>
      </div>
    </div>
  );
};
