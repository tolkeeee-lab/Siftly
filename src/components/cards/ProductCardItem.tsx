'use client';

import React, { ChangeEvent, useRef } from 'react';
import {
  FileText,
  Calculator,
  Copy,
  Trash2,
  Edit2,
  ExternalLink,
  Target,
  Award,
  DollarSign,
  Layers,
  Truck,
} from 'lucide-react';
import { ProductData } from '../../types/product';
import {
  calculateCOGS,
  calculateMargin,
  calculateMarginPct,
  calculateNoteFinale,
  calculateFreightCost,
} from '../../utils/calculations';
import { calculateBreakEven } from '../../utils/breakEven';
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

  const frais = calculateFreightCost(product);
  const cogs = calculateCOGS(product);
  const margin = calculateMargin(product);
  const marginPct = calculateMarginPct(product);
  const { noteText, noteNum } = calculateNoteFinale(product);
  const breakEven = calculateBreakEven(product, 50, 50000, 5000, 20, 80, 1000);
  const isWinner = isRankingActive && index === 0;

  const rankBadge =
    index === 0 ? '🥇 #1 Produit Gagnant' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`;

  const criteriaList = [
    { key: 'douleur', label: 'Douleur', val: product.douleur },
    { key: 'nonres', label: 'Non-rés.', val: product.nonres },
    { key: 'etendue', label: 'Étendue', val: product.etendue },
    { key: 'impact', label: 'Impact', val: product.impact },
    { key: 'waouh', label: 'Waouh', val: product.waouh },
    { key: 'innovant', label: 'Innovant', val: product.innovant },
    { key: 'nonsaison', label: 'Saison', val: product.nonsaison },
    { key: 'habitudes', label: 'Habitudes', val: product.habitudes },
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
    <div className={`product-card-frame ${isWinner ? 'winner-frame' : ''}`}>
      {/* Header Banner */}
      <div className="card-frame-header">
        <div className="card-frame-header-left">
          <div className="card-frame-badge-line">
            <span className={`card-frame-rank ${index === 0 ? 'gold' : ''}`}>{rankBadge}</span>
            <span className="card-frame-sub-label">Fiche d'Analyse Produit</span>
          </div>

          <input
            className="card-frame-title-input"
            type="text"
            placeholder="Nom du produit"
            value={product.produit}
            onChange={(e) => onUpdate(product.id, 'produit', e.target.value)}
          />

          <div className="card-frame-meta-line">
            <span>Marché : <strong>{product.marche || 'Chine'}</strong></span>
            <span>·</span>
            <div className="mode-switch-inline">
              <span>Mode :</span>
              <button
                type="button"
                className={`mode-btn-mini ${(product.modeimport || 'bateau') === 'bateau' ? 'active' : ''}`}
                onClick={() => onUpdate(product.id, 'modeimport', 'bateau')}
              >
                🚢 Bateau
              </button>
              <button
                type="button"
                className={`mode-btn-mini ${product.modeimport === 'avion' ? 'active' : ''}`}
                onClick={() => onUpdate(product.id, 'modeimport', 'avion')}
              >
                ✈️ Avion
              </button>
            </div>
          </div>
        </div>

        {/* Note Finale Pill */}
        <div className="card-frame-score-box">
          <div className="card-frame-score-lbl">Note Finale</div>
          <div className="card-frame-score-pill" style={getScoreColorStyle(noteNum)}>
            {noteText}
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="card-frame-grid">
        {/* Left Column: Image, Target, Angle, Links */}
        <div className="card-frame-left">
          {/* Photo */}
          <div
            className="card-frame-img-box"
            onClick={() => (product.imgSrc ? onOpenLightbox(product.imgSrc) : fileInputRef.current?.click())}
          >
            {product.imgSrc ? (
              <img src={product.imgSrc} alt={product.produit} />
            ) : (
              <div className="card-frame-img-placeholder">+ Photo</div>
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
                className="card-frame-img-edit"
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

          {/* Target & Angle */}
          <div className="card-frame-mkt-box">
            <div className="mkt-item">
              <div className="mkt-lbl">
                <Target className="w-3 h-3 text-gold-deep" /> Cible Marketing :
              </div>
              <input
                className="mkt-input"
                type="text"
                placeholder="Cible marketing..."
                value={product.cible || ''}
                onChange={(e) => onUpdate(product.id, 'cible', e.target.value)}
              />
            </div>

            <div className="mkt-item">
              <div className="mkt-lbl">
                <Award className="w-3 h-3 text-gold-deep" /> Angle d'Attaque :
              </div>
              <input
                className="mkt-input"
                type="text"
                placeholder="Angle d'attaque..."
                value={product.angle || ''}
                onChange={(e) => onUpdate(product.id, 'angle', e.target.value)}
              />
            </div>
          </div>

          {/* Links */}
          <div className="card-frame-links">
            {product.creative && (
              <a href={product.creative} target="_blank" rel="noopener noreferrer" className="frame-link">
                <ExternalLink className="w-2.5 h-2.5" /> Creative Ad
              </a>
            )}
            {product.alibaba && (
              <a href={product.alibaba} target="_blank" rel="noopener noreferrer" className="frame-link">
                <ExternalLink className="w-2.5 h-2.5" /> Fournisseur 1688
              </a>
            )}
            {product.siteweb && (
              <a href={product.siteweb} target="_blank" rel="noopener noreferrer" className="frame-link">
                <ExternalLink className="w-2.5 h-2.5" /> Site Concurrent
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Financial Breakdown, 9 Criteria, COD */}
        <div className="card-frame-right">
          {/* Bilan Financier Box (Gold) */}
          <div className="frame-section-box gold-box">
            <div className="frame-section-title text-gold-deep">
              <DollarSign className="w-3.5 h-3.5" /> Bilan Financier & Rentabilité
            </div>

            <div className="financial-mini-grid">
              <div className="fin-card">
                <div className="fin-lbl">Sourcing</div>
                <div className="fin-val-wrap">
                  <input
                    type="number"
                    className="fin-in"
                    placeholder="0"
                    value={product.sourcing ?? ''}
                    onChange={(e) => onUpdate(product.id, 'sourcing', e.target.value)}
                  />
                  {onOpenCurrencyConverter && (
                    <button
                      type="button"
                      className="currency-btn mini"
                      title="Convertir ¥/$"
                      onClick={() => onOpenCurrencyConverter(product.id)}
                    >
                      ¥/$
                    </button>
                  )}
                </div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Frais Transport</div>
                <div className="fin-val">{formatFCFA(frais)}</div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">CAC + Livraison</div>
                <div className="fin-val">{formatFCFA(Number(product.cac) + Number(product.livraison))}</div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">COGS (Coût Total)</div>
                <div className="fin-val bold">{formatFCFA(cogs)}</div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Prix de Vente</div>
                <input
                  type="number"
                  className="fin-in bold text-gold-deep"
                  placeholder="0"
                  value={product.vente ?? ''}
                  onChange={(e) => onUpdate(product.id, 'vente', e.target.value)}
                />
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Marge Brute (%)</div>
                <div className="fin-val bold" style={getMarginColorStyle(marginPct, true)}>
                  {formatFCFA(margin)} ({Number(product.vente) > 0 ? marginPct.toFixed(1) + '%' : '—'})
                </div>
              </div>
            </div>
          </div>

          {/* 9 Critères Validation (Rust) */}
          <div className="frame-section-box rust-box">
            <div className="frame-section-title text-rust">
              <Layers className="w-3.5 h-3.5" /> Détail des 9 Critères de Validation
            </div>
            <div className="criteria-mini-grid">
              {criteriaList.map((c) => (
                <div key={c.key} className="criteria-chip">
                  <span className="criteria-chip-lbl">{c.label}</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className="criteria-chip-in"
                    style={getScoreColorStyle(c.val)}
                    value={c.val ?? ''}
                    onChange={(e) => onUpdate(product.id, c.key as any, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COD & Ventes / Jour (Sage) */}
          <div className="frame-section-box sage-box">
            <div className="frame-section-title text-sage">
              <Truck className="w-3.5 h-3.5" /> Objectifs Ventes & Réalité COD (Taux 80%)
            </div>
            <div className="cod-mini-row">
              <div>
                <span className="cod-lbl">Objectif quotidien :</span>
                <strong className="cod-val text-gold-deep">{breakEven.dailySalesForStock} v/jour</strong>
              </div>
              <div>
                <span className="cod-lbl">Seuil de rentabilité :</span>
                <strong className="cod-val text-sage">{breakEven.breakEvenUnits} unités ({breakEven.sellThroughPctNeeded}%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions Bar */}
      <div className="card-frame-footer">
        <div className="frame-actions-left">
          <button
            type="button"
            className="frame-btn primary"
            title="Générer la Fiche Produit Imprimable (PDF One-Pager)"
            onClick={() => onOpenOnePager(product, index)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fiche PDF</span>
          </button>

          <button
            type="button"
            className="frame-btn secondary"
            title="Calculer le Seuil de Rentabilité (Break-Even)"
            onClick={() => onOpenBreakEven(product)}
          >
            <Calculator className="w-3.5 h-3.5 text-steel" />
            <span>Rentabilité COD</span>
          </button>
        </div>

        <div className="frame-actions-right">
          <button
            type="button"
            className="rowdel"
            title="Dupliquer la fiche"
            onClick={() => onDuplicate(product.id)}
          >
            <Copy className="w-3.5 h-3.5 text-gold-deep" />
          </button>
          <button
            type="button"
            className="rowdel"
            title="Supprimer la fiche"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
