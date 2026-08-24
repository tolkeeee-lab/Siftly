'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ProductData } from '../../types/product';
import { TableHeader } from './TableHeader';
import { ProductRow } from './ProductRow';

interface ProductTableProps {
  products: ProductData[];
  onUpdateProduct: (id: string, field: keyof ProductData, value: any) => void;
  onDuplicateProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onUpdateProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onAddProduct,
  onOpenLightbox,
}) => {
  return (
    <div className="panel">
      <table id="eaa-table">
        <TableHeader />
        <tbody>
          {products.map((p, index) => (
            <ProductRow
              key={p.id}
              index={index}
              product={p}
              onUpdate={onUpdateProduct}
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
