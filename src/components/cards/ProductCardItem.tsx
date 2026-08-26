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
  Ship,
  Plane,
} from 'lucide-react';
import { ProductData, ImportMode } from '../../types/product';
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
    { key: 'nonsaison', label: 'Non-saison', val: product.nonsaison },
    { key: 'habitudes', label: 'Habitudes', val: product.habitudes },
    { key: 'poidsfacteur', label: 'Facteur poids', val: product.poidsfacteur },
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
    <div
      style={{
        background: '#F7F2E4',
        border: isWinner ? '2.5px solid #B8862F' : '1px solid #DCD3B8',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: '#1E1B14',
        boxShadow: isWinner ? '0 8px 24px rgba(184, 134, 47, 0.25)' : '0 4px 16px rgba(0, 0, 0, 0.12)',
        position: 'relative',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          borderBottom: '2px solid #1E1B14',
          paddingBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: index === 0 ? '#B8862F' : '#141B32',
                color: index === 0 ? '#241C0C' : '#fff',
                padding: '3px 9px',
                borderRadius: '14px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {rankBadge}
            </span>
            <span style={{ fontSize: '11px', color: '#6B6353', fontFamily: 'monospace' }}>
              Fiche d'Analyse Produit
            </span>
          </div>

          <input
            style={{
              margin: 0,
              fontSize: '20px',
              fontFamily: 'Georgia, serif',
              fontWeight: 600,
              color: '#1E1B14',
              width: '100%',
              border: 'none',
              background: 'transparent',
              padding: '2px 0',
              outline: 'none',
            }}
            type="text"
            placeholder="Nom du produit"
            value={product.produit}
            onChange={(e) => onUpdate(product.id, 'produit', e.target.value)}
          />

          <div style={{ fontSize: '11.5px', color: '#6B6353', marginTop: '2px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>Marché : <strong>{product.marche || 'Chine'}</strong></span>
            <span>·</span>
            <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
              <span>Mode :</span>
              <button
                type="button"
                style={{
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #DCD3B8',
                  background: (product.modeimport || 'bateau') === 'bateau' ? '#DAE3E8' : 'transparent',
                  color: '#141B32',
                  cursor: 'pointer',
                  fontWeight: (product.modeimport || 'bateau') === 'bateau' ? 700 : 400,
                }}
                onClick={() => onUpdate(product.id, 'modeimport', 'bateau')}
              >
                🚢 Bateau
              </button>
              <button
                type="button"
                style={{
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #DCD3B8',
                  background: product.modeimport === 'avion' ? '#DAE3E8' : 'transparent',
                  color: '#141B32',
                  cursor: 'pointer',
                  fontWeight: product.modeimport === 'avion' ? 700 : 400,
                }}
                onClick={() => onUpdate(product.id, 'modeimport', 'avion')}
              >
                ✈️ Avion
              </button>
            </div>
          </div>
        </div>

        {/* Note Finale Pill */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6353', fontFamily: 'monospace', marginBottom: '2px' }}>
            Note Finale
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'monospace',
              ...getScoreColorStyle(noteNum),
              padding: '2px 10px',
              borderRadius: '6px',
              display: 'inline-block',
            }}
          >
            {noteText}
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px' }}>
        {/* Left Column: Image, Target, Angle, Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Photo */}
          <div
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#EFE0BB',
              border: '1px solid #DCD3B8',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => (product.imgSrc ? onOpenLightbox(product.imgSrc) : fileInputRef.current?.click())}
          >
            {product.imgSrc ? (
              <img
                src={product.imgSrc}
                alt={product.produit}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A5A1E', fontFamily: 'monospace' }}>
                + Ajouter Photo
              </div>
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
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(20, 27, 50, 0.85)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
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
          <div style={{ background: '#fff', border: '1px solid #DCD3B8', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#7A5A1E', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'monospace' }}>
                <Target className="w-3 h-3" /> Cible Marketing :
              </div>
              <input
                style={{ border: 'none', background: 'transparent', fontSize: '12px', color: '#1E1B14', width: '100%', padding: '0', outline: 'none' }}
                type="text"
                placeholder="Cible marketing..."
                value={product.cible || ''}
                onChange={(e) => onUpdate(product.id, 'cible', e.target.value)}
              />
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#7A5A1E', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'monospace' }}>
                <Award className="w-3 h-3" /> Angle d'Attaque :
              </div>
              <input
                style={{ border: 'none', background: 'transparent', fontSize: '12px', color: '#1E1B14', width: '100%', padding: '0', outline: 'none' }}
                type="text"
                placeholder="Angle d'attaque..."
                value={product.angle || ''}
                onChange={(e) => onUpdate(product.id, 'angle', e.target.value)}
              />
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
            {product.creative && (
              <a href={product.creative} target="_blank" rel="noopener noreferrer" style={{ color: '#7A5A1E', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontFamily: 'monospace' }}>
                <ExternalLink className="w-2.5 h-2.5" /> Creative Ad
              </a>
            )}
            {product.alibaba && (
              <a href={product.alibaba} target="_blank" rel="noopener noreferrer" style={{ color: '#7A5A1E', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontFamily: 'monospace' }}>
                <ExternalLink className="w-2.5 h-2.5" /> Fournisseur Alibaba
              </a>
            )}
            {product.siteweb && (
              <a href={product.siteweb} target="_blank" rel="noopener noreferrer" style={{ color: '#7A5A1E', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontFamily: 'monospace' }}>
                <ExternalLink className="w-2.5 h-2.5" /> Site Concurrent
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Financial Breakdown, 9 Criteria, COD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Bilan Financier Box (Gold) */}
          <div style={{ background: '#EFE0BB', border: '1px solid rgba(184,134,47,0.35)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A5A1E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}>
              <DollarSign className="w-3.5 h-3.5" /> Bilan Financier & Rentabilité
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
              <div style={{ background: '#fff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #DCD3B8' }}>
                <div style={{ fontSize: '9.5px', color: '#6B6353', textTransform: 'uppercase', fontFamily: 'monospace' }}>Sourcing</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="number"
                    style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', width: '100%', outline: 'none' }}
                    placeholder="0"
                    value={product.sourcing ?? ''}
                    onChange={(e) => onUpdate(product.id, 'sourcing', e.target.value)}
                  />
                  {onOpenCurrencyConverter && (
                    <button
                      type="button"
                      style={{ fontSize: '9px', padding: '1px 4px', background: '#EFE0BB', border: '1px solid #DCD3B8', borderRadius: '3px', color: '#7A5A1E', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 700 }}
                      title="Convertir ¥/$"
                      onClick={() => onOpenCurrencyConverter(product.id)}
                    >
                      ¥/$
                    </button>
                  )}
                </div>
              </div>

              <div style={{ background: '#fff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #DCD3B8' }}>
                <div style={{ fontSize: '9.5px', color: '#6B6353', textTransform: 'uppercase', fontFamily: 'monospace' }}>Frais Transport</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{formatFCFA(frais)}</div>
              </div>

              <div style={{ background: '#fff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #DCD3B8' }}>
                <div style={{ fontSize: '9.5px', color: '#6B6353', textTransform: 'uppercase', fontFamily: 'monospace' }}>CAC + Livraison</div>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{formatFCFA(Number(product.cac) + Number(product.livraison))}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', borderTop: '1px dashed #DCD3B8', paddingTop: '8px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#6B6353', fontFamily: 'monospace' }}>COGS (Coût Total)</div>
                <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>{formatFCFA(cogs)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#6B6353', fontFamily: 'monospace' }}>Prix de Vente</div>
                <input
                  type="number"
                  style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#7A5A1E', fontFamily: 'monospace', width: '100%', outline: 'none' }}
                  placeholder="0"
                  value={product.vente ?? ''}
                  onChange={(e) => onUpdate(product.id, 'vente', e.target.value)}
                />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#6B6353', fontFamily: 'monospace' }}>Marge Brute (%)</div>
                <div style={{ fontSize: '15px', fontWeight: 700, ...getMarginColorStyle(marginPct, true), fontFamily: 'monospace' }}>
                  {formatFCFA(margin)} ({Number(product.vente) > 0 ? marginPct.toFixed(1) + '%' : '—'})
                </div>
              </div>
            </div>
          </div>

          {/* 9 Critères Validation (Rust) */}
          <div style={{ background: '#F0DBCB', border: '1px solid rgba(139,46,26,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#8B2E1A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}>
              <Layers className="w-3.5 h-3.5" /> Détail des 9 Critères de Validation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {criteriaList.map((c) => (
                <div
                  key={c.key}
                  style={{
                    background: '#fff',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10.5px',
                    fontFamily: 'monospace',
                  }}
                >
                  <span style={{ color: '#6B6353', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.label}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    style={{
                      width: '24px',
                      border: 'none',
                      textAlign: 'right',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      borderRadius: '2px',
                      ...getScoreColorStyle(c.val),
                    }}
                    value={c.val ?? ''}
                    onChange={(e) => onUpdate(product.id, c.key as any, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COD & Ventes / Jour (Sage) */}
          <div style={{ background: '#DCE6D3', border: '1px solid rgba(75,107,69,0.25)', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#4B6B45', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}>
              <Truck className="w-3.5 h-3.5" /> Objectifs Ventes & Réalité COD (Taux 80%)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
              <div>
                <span style={{ color: '#6B6353' }}>Ventes / jour : </span>
                <strong style={{ color: '#7A5A1E' }}>{breakEven.dailySalesForStock} v/jour</strong>
              </div>
              <div>
                <span style={{ color: '#6B6353' }}>Seuil rentabilité : </span>
                <strong style={{ color: '#4B6B45' }}>{breakEven.breakEvenUnits} unités ({breakEven.sellThroughPctNeeded}%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions Bar */}
      <div
        style={{
          borderTop: '1px solid #DCD3B8',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontFamily: 'monospace',
              fontWeight: 700,
              cursor: 'pointer',
              background: '#B8862F',
              border: '1px solid #B8862F',
              color: '#241C0C',
            }}
            title="Générer la Fiche Produit Imprimable (PDF One-Pager)"
            onClick={() => onOpenOnePager(product, index)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fiche PDF</span>
          </button>

          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontFamily: 'monospace',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid #DCD3B8',
              color: '#1E1B14',
            }}
            title="Calculer le Seuil de Rentabilité (Break-Even)"
            onClick={() => onOpenBreakEven(product)}
          >
            <Calculator className="w-3.5 h-3.5 text-steel" />
            <span>Rentabilité COD</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
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
