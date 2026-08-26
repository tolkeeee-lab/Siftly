'use client';

import React from 'react';
import { X, Copy, Calculator, FileText, Sparkles } from 'lucide-react';
import { ProductData } from '../../../types/product';

interface MarketingCellsProps {
  product: ProductData;
  showMarketing?: boolean;
  onChange: (field: keyof ProductData, value: any) => void;
  onOpenBreakEven: () => void;
  onOpenOnePager?: () => void;
  onOpenMarketAnalysis?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const MarketingCells: React.FC<MarketingCellsProps> = ({
  product,
  showMarketing = true,
  onChange,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenMarketAnalysis,
  onDuplicate,
  onDelete,
}) => {
  return (
    <>
      {showMarketing && (
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
        </>
      )}
      <td>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {onOpenMarketAnalysis && (
            <button
              className="rowdel"
              type="button"
              title="🔬 Radar d'Analyse de Marché & Intelligence EAA"
              onClick={onOpenMarketAnalysis}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
          )}
          {onOpenOnePager && (
            <button
              className="rowdel"
              type="button"
              title="Générer la Fiche Produit (PDF One-Pager)"
              onClick={onOpenOnePager}
            >
              <FileText className="w-3 h-3 text-gold-deep" />
            </button>
          )}
          <button
            className="rowdel"
            type="button"
            title="Calculer le Seuil de Rentabilité (Break-Even)"
            onClick={onOpenBreakEven}
          >
            <Calculator className="w-3 h-3 text-steel" />
          </button>
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
