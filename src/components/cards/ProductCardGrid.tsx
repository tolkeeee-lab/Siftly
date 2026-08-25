'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ProductData } from '../../types/product';
import { ProductCardItem } from './ProductCardItem';

interface ProductCardGridProps {
  products: ProductData[];
  isRankingActive?: boolean;
  onUpdateProduct: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onOpenOnePager: (product: ProductData, rankIndex: number) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
  onDuplicateProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  products,
  isRankingActive = true,
  onUpdateProduct,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenCurrencyConverter,
  onDuplicateProduct,
  onDeleteProduct,
  onAddProduct,
  onOpenLightbox,
}) => {
  return (
    <div className="product-card-grid-container">
      <div className="product-card-grid">
        {products.map((p, index) => (
          <ProductCardItem
            key={p.id}
            index={index}
            product={p}
            isRankingActive={isRankingActive}
            onUpdate={onUpdateProduct}
            onOpenBreakEven={onOpenBreakEven}
            onOpenOnePager={onOpenOnePager}
            onOpenCurrencyConverter={onOpenCurrencyConverter}
            onDuplicate={onDuplicateProduct}
            onDelete={onDeleteProduct}
            onOpenLightbox={onOpenLightbox}
          />
        ))}

        {/* Add Product Card */}
        <button type="button" className="add-product-card" onClick={onAddProduct}>
          <div className="add-card-icon-wrap">
            <Plus className="w-6 h-6 text-gold" />
          </div>
          <span className="add-card-label">Ajouter un nouveau produit</span>
          <span className="add-card-sub">Créer une nouvelle fiche d'évaluation</span>
        </button>
      </div>
    </div>
  );
};
