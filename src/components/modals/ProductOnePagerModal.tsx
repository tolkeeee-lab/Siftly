'use client';

import React from 'react';
import {
  Printer,
  X,
  ExternalLink,
  Award,
  TrendingUp,
  Truck,
  Target,
  DollarSign,
  Package,
  Layers,
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

interface ProductOnePagerModalProps {
  product: ProductData | null;
  rankIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductOnePagerModal: React.FC<ProductOnePagerModalProps> = ({
  product,
  rankIndex = 0,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const frais = calculateFreightCost(product);
  const cogs = calculateCOGS(product);
  const margin = calculateMargin(product);
  const marginPct = calculateMarginPct(product);
  const { noteText, noteNum } = calculateNoteFinale(product);
  const breakEven = calculateBreakEven(product, 50, 50000, 5000, 20, 80, 1000);

  const rankBadge =
    rankIndex === 0 ? '🥇 #1 Produit Gagnant' : rankIndex === 1 ? '🥈 #2' : rankIndex === 2 ? '🥉 #3' : `#${rankIndex + 1}`;

  const criteriaList = [
    { label: 'Douleur problème', val: product.douleur },
    { label: 'Coût non-résolution', val: product.nonres },
    { label: 'Étendue marché', val: product.etendue },
    { label: 'Impact avant/après', val: product.impact },
    { label: 'Effet waouh', val: product.waouh },
    { label: 'Caractère innovant', val: product.innovant },
    { label: 'Non-saisonnalité', val: product.nonsaison },
    { label: 'Habitudes conso', val: product.habitudes },
    { label: 'Facteur poids', val: product.poidsfacteur },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="paste-modal open one-pager-overlay" onClick={onClose}>
      <div
        className="paste-box one-pager-container"
        style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Actions (Hidden on Print) */}
        <div className="one-pager-actions no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: rankIndex === 0 ? '#B8862F' : '#141B32',
                color: rankIndex === 0 ? '#241C0C' : '#fff',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {rankBadge}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
              Fiche d'Analyse Produit
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="tbtn save"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Imprimer / PDF
            </button>
            <button type="button" className="rowdel" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="one-pager-printable">
          {/* Header */}
          <div
            style={{
              borderBottom: '2px solid var(--ink)',
              paddingBottom: '12px',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--ink)' }}>
                {product.produit || 'Produit sans nom'}
              </h1>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px', fontFamily: 'monospace' }}>
                Marché d'origine : <strong>{product.marche || 'Non spécifié'}</strong> · Mode import :{' '}
                <strong>{product.modeimport === 'avion' ? '✈️ Avion' : '🚢 Bateau'}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
                Note de Validation
              </div>
              <div
                style={{
                  fontSize: '22px',
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

          {/* Main 2-Column Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Left Column: Media & Marketing */}
            <div>
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--gold-wash)',
                  marginBottom: '14px',
                  border: '1px solid var(--panel-line)',
                }}
              >
                {product.imgSrc ? (
                  <img
                    src={product.imgSrc}
                    alt={product.produit}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                    Pas d'image
                  </div>
                )}
              </div>

              {/* Marketing Angle & Target */}
              <div style={{ background: '#fff', border: '1px solid var(--panel-line)', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target className="w-3.5 h-3.5" /> Cible Marketing :
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '8px' }}>
                  {product.cible || '—'}
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award className="w-3.5 h-3.5" /> Angle d'Attaque :
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
                  {product.angle || '—'}
                </div>
              </div>

              {/* External Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {product.creative && (
                  <a href={product.creative} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink className="w-3 h-3" /> Creative Ad
                  </a>
                )}
                {product.alibaba && (
                  <a href={product.alibaba} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink className="w-3 h-3" /> Fournisseur Alibaba / 1688
                  </a>
                )}
                {product.siteweb && (
                  <a href={product.siteweb} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink className="w-3 h-3" /> Site Concurrent
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Financial Breakdown & Score Radar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Financial Box */}
              <div style={{ background: 'var(--gold-wash)', border: '1px solid rgba(184,134,47,0.3)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign className="w-4 h-4" /> Bilan Financier & Rentabilité
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>Sourcing Brut</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{formatFCFA(Number(product.sourcing))}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>Frais Transport</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{formatFCFA(frais)}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>CAC + Livraison</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{formatFCFA(Number(product.cac) + Number(product.livraison))}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderTop: '1px dashed var(--panel-line)', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>COGS (Coût Total)</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace' }}>{formatFCFA(cogs)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Prix de Vente</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold-deep)', fontFamily: 'monospace' }}>{formatFCFA(Number(product.vente))}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Marge Brute (%)</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, ...getMarginColorStyle(marginPct, true), fontFamily: 'monospace' }}>
                      {formatFCFA(margin)} ({marginPct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* 9 Score Criteria Grid */}
              <div style={{ background: 'var(--rust-wash)', border: '1px solid rgba(139,46,26,0.2)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#8B2E1A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers className="w-4 h-4" /> Détail des 9 Critères de Validation
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {criteriaList.map((c) => (
                    <div
                      key={c.label}
                      style={{
                        background: '#fff',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11.5px',
                      }}
                    >
                      <span style={{ color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          ...getScoreColorStyle(c.val),
                        }}
                      >
                        {c.val !== '' && c.val != null ? c.val : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COD & Break-Even Goals */}
              <div style={{ background: 'var(--sage-wash)', border: '1px solid rgba(75,107,69,0.3)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck className="w-4 h-4" /> Objectifs Ventes & Réalité COD (Taux 80%)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Objectif Ventes / Jour (Stock 50 pcs)</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold-deep)', fontFamily: 'monospace' }}>
                      {breakEven.dailySalesForStock} ventes / jour
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Seuil de Rentabilité Global</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--sage)', fontFamily: 'monospace' }}>
                      {breakEven.breakEvenUnits} unités ({breakEven.sellThroughPctNeeded}% du stock)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ borderTop: '1px solid var(--panel-line)', paddingTop: '8px', fontSize: '10px', color: 'var(--ink-faint)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Siftly EAA — Plateforme d'analyse et validation produit E-commerce</span>
            <span>Généré le {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
