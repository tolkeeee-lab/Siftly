'use client';

import React, { ChangeEvent, useRef } from 'react';
import { Edit2 } from 'lucide-react';
import { ProductData } from '../../../types/product';
import { compressImage } from '../../../utils/imageCompressor';

interface IdentificationCellsProps {
  product: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
  onOpenLightbox: (src: string) => void;
}

export const IdentificationCells: React.FC<IdentificationCellsProps> = ({
  product,
  onChange,
  onOpenLightbox,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const rawDataUrl = reader.result as string;
      const compressed = await compressImage(rawDataUrl, 500, 0.75);
      onChange('imgSrc', compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleCellClick = () => {
    if (product.imgSrc) {
      onOpenLightbox(product.imgSrc);
    }
  };

  return (
    <>
      <td>
        <input
          className="cell-in produit-name"
          type="text"
          placeholder="Nom du produit"
          value={product.produit}
          onChange={(e) => onChange('produit', e.target.value)}
        />
      </td>
      <td>
        <div
          className={`img-cell ${product.imgSrc ? 'has-img' : ''}`}
          onClick={handleCellClick}
        >
          {product.imgSrc ? (
            <img src={product.imgSrc} alt={product.produit || 'Produit'} />
          ) : (
            <span className="plus">+</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageFile}
          />
          {product.imgSrc && (
            <button
              type="button"
              className="img-edit-btn"
              title="Changer l'image"
              onClick={handleEditClick}
            >
              <Edit2 className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      </td>
      <td>
        <input
          className="cell-in wide"
          type="text"
          placeholder="Lien creative"
          value={product.creative || ''}
          onChange={(e) => onChange('creative', e.target.value)}
        />
      </td>
      <td>
        <input
          className="cell-in wide"
          type="text"
          placeholder="Lien Alibaba"
          value={product.alibaba || ''}
          onChange={(e) => onChange('alibaba', e.target.value)}
        />
      </td>
      <td className="group-end">
        <input
          className="cell-in wide"
          type="text"
          placeholder="Site web"
          value={product.siteweb || ''}
          onChange={(e) => onChange('siteweb', e.target.value)}
        />
      </td>
      <td>
        <input
          className="cell-in"
          type="text"
          placeholder="Marché"
          value={product.marche || ''}
          onChange={(e) => onChange('marche', e.target.value)}
        />
      </td>
    </>
  );
};
