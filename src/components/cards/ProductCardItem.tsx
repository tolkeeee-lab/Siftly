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
  Link as LinkIcon,
  Globe,
  ShoppingBag,
  Sparkles,
  Download,
} from 'lucide-react';
import { ProductData, PRODUCT_CATEGORIES } from '../../types/product';
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
  onOpenMarketAnalysis?: (product: ProductData) => void;
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
  onOpenMarketAnalysis,
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

  const handleExportHTML = () => {
    try {
      const cardId = `product-card-${product.id}`;
      const cardNode = document.getElementById(cardId);
      if (!cardNode) return;

      // Ensure input values are reflected in attributes before cloning
      const inputs = cardNode.querySelectorAll('input, textarea');
      inputs.forEach((input: any) => {
        if (input.type === 'checkbox') {
          if (input.checked) input.setAttribute('checked', 'checked');
          else input.removeAttribute('checked');
        } else {
          input.setAttribute('value', input.value);
          if (input.tagName === 'TEXTAREA') {
            input.textContent = input.value;
          }
        }
      });

      const clone = cardNode.cloneNode(true) as HTMLElement;
      
      // Remove footer actions from export
      const footer = clone.querySelector('.card-frame-footer');
      if (footer) footer.remove();
      
      // Optional: remove rowdel (trash) buttons from headers/lists
      clone.querySelectorAll('.rowdel').forEach(el => el.remove());

      let styles = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          if (sheet.cssRules) {
            for (const rule of Array.from(sheet.cssRules)) {
              styles += rule.cssText + '\\n';
            }
          }
        } catch (e) {}
      }

      const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Fiche Produit - ${product.produit || 'Nouveau'}</title>
  <style>
    body { background-color: #0F172A; color: #F8FAFC; padding: 2rem; display: flex; justify-content: center; }
    ${styles}
    .product-card-frame { margin: 0 auto; max-width: 800px; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fiche_Produit_${product.produit.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id={`product-card-${product.id}`} className={`product-card-frame ${isWinner ? 'winner-frame' : ''}`}>
      {/* Header Banner */}
      <div className="card-frame-header">
        <div className="card-frame-header-left">
          <div className="card-frame-badge-line">
            <span className={`card-frame-rank ${index === 0 ? 'gold' : ''}`}>{rankBadge}</span>
            <span className="card-frame-sub-label">Fiche d'Analyse Produit</span>
          </div>

          <textarea
            className="card-frame-title-textarea"
            rows={2}
            placeholder="Nom du produit..."
            value={product.produit}
            onChange={(e) => onUpdate(product.id, 'produit', e.target.value)}
          />

          <div className="card-frame-meta-line">
            <div className="meta-inline-edit">
              <span>Marché :</span>
              <input
                className="meta-input-inline"
                type="text"
                placeholder="Chine"
                value={product.marche || ''}
                onChange={(e) => onUpdate(product.id, 'marche', e.target.value)}
              />
            </div>
            <span>·</span>
            <div className="meta-inline-edit">
              <span>Niche :</span>
              <select
                className="meta-input-inline"
                value={product.category || 'Maison & Confort'}
                onChange={(e) => onUpdate(product.id, 'category', e.target.value)}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
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
        {/* Left Column: Image, Target, Angle, Editable Links */}
        <div className="card-frame-left">
          {/* Photo */}
          <div
            className="card-frame-img-box"
            onClick={() => (product.imgSrc ? onOpenLightbox(product.imgSrc) : fileInputRef.current?.click())}
          >
            {product.imgSrc ? (
              <img src={product.imgSrc} alt={product.produit} />
            ) : (
              <div className="card-frame-img-placeholder">+ Ajouter Photo</div>
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

          {/* Target & Angle with Wrapping Textareas */}
          <div className="card-frame-mkt-box">
            <div className="mkt-item">
              <div className="mkt-lbl">
                <Target className="w-3 h-3 text-gold-deep" /> Cible Marketing :
              </div>
              <textarea
                className="mkt-textarea"
                rows={2}
                placeholder="Cible visée (ex: Parents, Jeunes cadres...)"
                value={product.cible || ''}
                onChange={(e) => onUpdate(product.id, 'cible', e.target.value)}
              />
            </div>

            <div className="mkt-item">
              <div className="mkt-lbl">
                <Award className="w-3 h-3 text-gold-deep" /> Angle d'Attaque :
              </div>
              <textarea
                className="mkt-textarea"
                rows={2}
                placeholder="Angle de vente / promesse..."
                value={product.angle || ''}
                onChange={(e) => onUpdate(product.id, 'angle', e.target.value)}
              />
            </div>
          </div>

          {/* Editable Links Section */}
          <div className="card-frame-links-box">
            <div className="link-input-row">
              <LinkIcon className="w-3.5 h-3.5 text-gold-deep shrink-0" />
              <input
                className="link-input-field"
                type="text"
                placeholder="Lien Creative Ad..."
                value={product.creative || ''}
                title={product.creative || ''}
                onChange={(e) => onUpdate(product.id, 'creative', e.target.value)}
              />
              {product.creative && (
                <a href={product.creative} target="_blank" rel="noopener noreferrer" className="link-open-btn" title="Ouvrir le lien">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="link-input-row">
              <ShoppingBag className="w-3.5 h-3.5 text-gold-deep shrink-0" />
              <input
                className="link-input-field"
                type="text"
                placeholder="Lien Fournisseur (1688 / Alibaba)..."
                value={product.alibaba || ''}
                title={product.alibaba || ''}
                onChange={(e) => onUpdate(product.id, 'alibaba', e.target.value)}
              />
              {product.alibaba && (
                <a href={product.alibaba} target="_blank" rel="noopener noreferrer" className="link-open-btn" title="Ouvrir le lien">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="link-input-row">
              <Globe className="w-3.5 h-3.5 text-gold-deep shrink-0" />
              <input
                className="link-input-field"
                type="text"
                placeholder="Lien Site Concurrent..."
                value={product.siteweb || ''}
                title={product.siteweb || ''}
                onChange={(e) => onUpdate(product.id, 'siteweb', e.target.value)}
              />
              {product.siteweb && (
                <a href={product.siteweb} target="_blank" rel="noopener noreferrer" className="link-open-btn" title="Ouvrir le lien">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Breakdown, 9 Criteria, COD */}
        <div className="card-frame-right">
          {/* Bilan Financier Box (Gold) */}
          <div className="frame-section-box gold-box">
            <div className="frame-section-title text-gold-deep">
              <DollarSign className="w-3.5 h-3.5" /> Bilan Financier (Montants en FCFA)
            </div>

            <div className="financial-mini-grid">
              <div className="fin-card">
                <div className="fin-lbl">Sourcing (FCFA)</div>
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
                      title="Aide calcul FCFA"
                      onClick={() => onOpenCurrencyConverter(product.id)}
                    >
                      FCFA
                    </button>
                  )}
                </div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Poids (kg)</div>
                <input
                  type="number"
                  step="0.01"
                  className="fin-in"
                  placeholder="0"
                  value={product.poids ?? ''}
                  onChange={(e) => onUpdate(product.id, 'poids', e.target.value)}
                />
              </div>

              <div className="fin-card">
                <div className="fin-lbl">
                  Tarif Fret {product.modeimport === 'avion' ? '✈️ Avion' : '🚢 Bateau'} (F/kg)
                </div>
                <input
                  type="number"
                  className="fin-in font-bold"
                  placeholder={product.modeimport === 'avion' ? '9000' : '3500'}
                  value={product.modeimport === 'avion' ? (product.tarifavion ?? '') : (product.tarifbateau ?? '')}
                  onChange={(e) => onUpdate(product.id, product.modeimport === 'avion' ? 'tarifavion' : 'tarifbateau', e.target.value)}
                  title="Modifier le tarif du fret par kg (ex: 3500 FCFA pour Bateau, 9000 FCFA pour Avion)"
                />
                <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '3px', fontWeight: 600 }}>
                  Frais Fret : <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--gold-deep)', fontWeight: 800 }}>{formatFCFA(frais)}</span>
                </div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">CAC Pub (FCFA)</div>
                <input
                  type="number"
                  className="fin-in"
                  placeholder="0"
                  value={product.cac ?? ''}
                  onChange={(e) => onUpdate(product.id, 'cac', e.target.value)}
                />
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Livraison (FCFA)</div>
                <input
                  type="number"
                  className="fin-in"
                  placeholder="0"
                  value={product.livraison ?? ''}
                  onChange={(e) => onUpdate(product.id, 'livraison', e.target.value)}
                />
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Prix Concurrent</div>
                <input
                  type="number"
                  className="fin-in"
                  placeholder="0"
                  value={product.concurrent ?? ''}
                  onChange={(e) => onUpdate(product.id, 'concurrent', e.target.value)}
                />
              </div>

              <div className="fin-card">
                <div className="fin-lbl">COGS Total (FCFA)</div>
                <div className="fin-val bold">{formatFCFA(cogs)}</div>
              </div>

              <div className="fin-card">
                <div className="fin-lbl">Prix de Vente (FCFA)</div>
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
              <Layers className="w-3.5 h-3.5" /> 9 Critères de Validation (Scores / 5)
            </div>
            <div className="criteria-mini-grid">
              {criteriaList.map((c) => (
                <div key={c.key} className="criteria-chip">
                  <span className="criteria-chip-lbl" title={c.label}>{c.label}</span>
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
                <span className="cod-lbl">Seuil rentabilité :</span>
                <strong className="cod-val text-sage">{breakEven.breakEvenUnits} unités ({breakEven.sellThroughPctNeeded}%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions Bar */}
      <div className="card-frame-footer">
        <div className="frame-actions-left">
          {onOpenMarketAnalysis && (
            <button
              type="button"
              className="frame-btn secondary"
              title="🔬 Radar d'Analyse de Marché & Intelligence EAA"
              onClick={() => onOpenMarketAnalysis(product)}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Analyse Marché</span>
            </button>
          )}

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
            title="Exporter la Fiche en HTML interactif"
            onClick={handleExportHTML}
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>HTML</span>
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
