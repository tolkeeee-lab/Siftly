'use client';

import React, { ChangeEvent, useRef } from 'react';
import {
  FileText,
  Calculator,
  Copy,
  X,
  Edit2,
  ExternalLink,
  Ship,
  Plane,
  Target,
  Award,
} from 'lucide-react';
import { ProductData, ImportMode } from '../../types/product';
import {
  calculateCOGS,
  calculateMargin,
  calculateMarginPct,
  calculateNoteFinale,
  calculateFreightCost,
} from '../../utils/calculations';
import { formatFCFA, getScoreColorStyle, getMarginColorStyle } from '../../utils/formatters';
import { compressImage } from '../../utils/imageCompressor';

interface ProductCardItemProps {
  product: ProductData;
  index: number;
  isRankingActive?: boolean;
  onUpdate: (id: string, field: keyof ProductData, value: any) => void;
  onOpenBreakEven: (product: ProductData) => void;
  onOpenOnePager: (product: ProductData, rankIndex: number) => void;
  onOpenCurrencyConverter?: (productId: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenLightbox: (src: string) => void;
}

export const ProductCardItem: React.FC<ProductCardItemProps> = ({
  product,
  index,
  isRankingActive = true,
  onUpdate,
  onOpenBreakEven,
  onOpenOnePager,
  onOpenCurrencyConverter,
  onDuplicate,
  onDelete,
  onOpenLightbox,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cogs = calculateCOGS(product);
  const margin = calculateMargin(product);
  const marginPct = calculateMarginPct(product);
  const frais = calculateFreightCost(product);
  const { noteText, noteNum } = calculateNoteFinale(product);
  const isWinner = isRankingActive && index === 0;

  const rankBadge =
    index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `#${index + 1}`;

  const criteriaList = [
    { key: 'douleur', label: 'Douleur', val: product.douleur },
    { key: 'nonres', label: 'Non-rés.', val: product.nonres },
    { key: 'etendue', label: 'Étendue', val: product.etendue },
    { key: 'impact', label: 'Impact', val: product.impact },
    { key: 'waouh', label: 'Waouh', val: product.waouh },
    { key: 'innovant', label: 'Innovant', val: product.innovant },
    { key: 'nonsaison', label: 'Saison', val: product.nonsaison },
    { key: 'habitudes', label: 'Habit.', val: product.habitudes },
    { key: 'poidsfacteur', label: 'Poids', val: product.poidsfacteur },
  ];

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result as string;
      const compressed = await compressImage(raw, 500, 0.75);
      onUpdate(product.id, 'imgSrc', compressed);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`product-card ${isWinner ? 'winner-card' : ''}`}>
      {/* Card Header */}
      <div className="product-card-header">
        <div className="product-card-title-wrap">
          <span className="card-rank-badge">{rankBadge}</span>
          <input
            className="card-title-input"
            type="text"
            placeholder="Nom du produit"
            value={product.produit}
            onChange={(e) => onUpdate(product.id, 'produit', e.target.value)}
          />
        </div>

        <div className="card-score-badge" style={getScoreColorStyle(noteNum)}>
          {noteText}
        </div>
      </div>

      {/* Media & Financial Row */}
      <div className="product-card-body">
        {/* Left: Thumbnail Image */}
        <div
          className="card-image-box"
          onClick={() => (product.imgSrc ? onOpenLightbox(product.imgSrc) : fileInputRef.current?.click())}
        >
          {product.imgSrc ? (
            <img src={product.imgSrc} alt={product.produit || 'Produit'} />
          ) : (
            <span className="card-image-placeholder">+ Photo</span>
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
              className="card-image-edit-btn"
              title="Changer l'image"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Edit2 className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        {/* Right: Key KPIs */}
        <div className="card-kpi-column">
          <div className="card-kpi-grid">
            <div className="card-kpi-item">
              <div className="card-kpi-lbl">Prix Vente</div>
              <input
                type="number"
                className="card-num-input font-bold text-gold-deep"
                placeholder="0"
                value={product.vente ?? ''}
                onChange={(e) => onUpdate(product.id, 'vente', e.target.value)}
              />
            </div>

            <div className="card-kpi-item">
              <div className="card-kpi-lbl">Marge Brute</div>
              <div className="card-kpi-val" style={getMarginColorStyle(marginPct, true)}>
                {formatFCFA(margin)}
              </div>
            </div>

            <div className="card-kpi-item">
              <div className="card-kpi-lbl">COGS (Coût)</div>
              <div className="card-kpi-val">{formatFCFA(cogs)}</div>
            </div>

            <div className="card-kpi-item">
              <div className="card-kpi-lbl">Marge %</div>
              <div className="card-kpi-val" style={getMarginColorStyle(marginPct, true)}>
                {Number(product.vente) > 0 ? marginPct.toFixed(1) + '%' : '—'}
              </div>
            </div>
          </div>

          {/* Sourcing & Shipping Controls */}
          <div className="card-shipping-row">
            <div className="card-sourcing-box">
              <span className="text-10 text-ink-soft">Sourcing :</span>
              <input
                type="number"
                className="card-num-input small"
                placeholder="0"
                value={product.sourcing ?? ''}
                onChange={(e) => onUpdate(product.id, 'sourcing', e.target.value)}
              />
              {onOpenCurrencyConverter && (
                <button
                  type="button"
                  className="currency-btn small"
                  title="Convertir Yuan (¥) ou Dollar ($) en FCFA"
                  onClick={() => onOpenCurrencyConverter(product.id)}
                >
                  ¥/$
                </button>
              )}
            </div>

            <div className="card-mode-toggle">
              <button
                type="button"
                className={`mode-pill ${product.modeimport === 'bateau' || !product.modeimport ? 'active' : ''}`}
                onClick={() => onUpdate(product.id, 'modeimport', 'bateau')}
              >
                <Ship className="w-3 h-3" /> Bateau
              </button>
              <button
                type="button"
                className={`mode-pill ${product.modeimport === 'avion' ? 'active' : ''}`}
                onClick={() => onUpdate(product.id, 'modeimport', 'avion')}
              >
                <Plane className="w-3 h-3" /> Avion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 9 Criteria Tag Pills */}
      <div className="card-criteria-strip">
        {criteriaList.map((c) => (
          <div key={c.key} className="criteria-pill" style={getScoreColorStyle(c.val)}>
            <span className="criteria-pill-lbl">{c.label}</span>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="criteria-pill-in"
              value={c.val ?? ''}
              onChange={(e) => onUpdate(product.id, c.key as any, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Marketing Context */}
      <div className="card-marketing-box">
        <div className="card-mkt-line">
          <Target className="w-3 h-3 text-gold-deep shrink-0" />
          <input
            className="card-text-in"
            type="text"
            placeholder="Cible marketing..."
            value={product.cible || ''}
            onChange={(e) => onUpdate(product.id, 'cible', e.target.value)}
          />
        </div>
        <div className="card-mkt-line">
          <Award className="w-3 h-3 text-gold-deep shrink-0" />
          <input
            className="card-text-in"
            type="text"
            placeholder="Angle d'attaque..."
            value={product.angle || ''}
            onChange={(e) => onUpdate(product.id, 'angle', e.target.value)}
          />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="product-card-footer">
        <div className="card-links-row">
          {product.creative && (
            <a href={product.creative} target="_blank" rel="noopener noreferrer" className="card-link" title="Creative Ad">
              Creative <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {product.alibaba && (
            <a href={product.alibaba} target="_blank" rel="noopener noreferrer" className="card-link" title="Alibaba / 1688">
              Alibaba <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {product.siteweb && (
            <a href={product.siteweb} target="_blank" rel="noopener noreferrer" className="card-link" title="Site Concurrent">
              Site <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        <div className="card-btns-row">
          <button
            type="button"
            className="card-action-btn primary"
            title="Ouvrir la Fiche Produit (PDF One-Pager)"
            onClick={() => onOpenOnePager(product, index)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fiche PDF</span>
          </button>

          <button
            type="button"
            className="card-action-btn"
            title="Calculer le Seuil de Rentabilité (Break-Even)"
            onClick={() => onOpenBreakEven(product)}
          >
            <Calculator className="w-3.5 h-3.5 text-steel" />
          </button>

          <button
            type="button"
            className="card-action-btn"
            title="Dupliquer la fiche"
            onClick={() => onDuplicate(product.id)}
          >
            <Copy className="w-3.5 h-3.5 text-gold-deep" />
          </button>

          <button
            type="button"
            className="card-action-btn delete"
            title="Supprimer la fiche"
            onClick={() => onDelete(product.id)}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
