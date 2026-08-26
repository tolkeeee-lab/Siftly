'use client';

import React, { useState } from 'react';
import { X, Printer, MessageSquare, Copy, Check, FileText } from 'lucide-react';
import { ProductData } from '../../../types/product';
import { VideoScript, MarketingAngle } from '../../../types/adsStudio';
import { formatFCFA } from '../../../utils/formatters';

interface ExportBriefModalProps {
  product: ProductData | null;
  scripts: VideoScript[];
  angles: MarketingAngle[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportBriefModal: React.FC<ExportBriefModalProps> = ({
  product,
  scripts,
  angles,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    let msg = `🎬 *BRIEF TOURNAGE & CRÉATION VIDÉO : ${product.produit?.toUpperCase()}*\n`;
    msg += `----------------------------------------\n`;
    msg += `📦 *Produit :* ${product.produit}\n`;
    msg += `🎯 *Cible :* ${product.cible || 'Non spécifiée'}\n`;
    msg += `💰 *Prix de vente :* ${formatFCFA(Number(product.vente) || 0)}\n\n`;
    msg += `📝 *SCRIPTS VIDÉOS À TOURNER :*\n\n`;

    scripts.forEach((sc, i) => {
      msg += `*--- SCRIPT ${i + 1} : ${sc.title} ---*\n`;
      msg += `🪝 *Hook :* ${sc.hookHeadline}\n`;
      sc.scenes.forEach((scene) => {
        msg += `• [${scene.timing}] ${scene.audio}\n`;
      });
      msg += `🎯 *CTA :* ${sc.callToAction}\n\n`;
    });

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="one-pager-overlay open" onClick={onClose}>
      <div className="one-pager-container po-print-box" onClick={(e) => e.stopPropagation()}>
        {/* Controls */}
        <div className="one-pager-header-controls no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="w-5 h-5 text-gold-deep" />
            <span style={{ fontFamily: 'Georgia', fontSize: '16px', fontWeight: 600 }}>
              Brief Créatif UGC & Montage Vidéo
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="po-action-btn whatsapp" onClick={handleCopyWhatsApp}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié pour WhatsApp !' : 'Copier WhatsApp'}</span>
            </button>
            <button type="button" className="tbtn save" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button type="button" className="rowdel" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="po-printable-area">
          <div className="po-doc-masthead">
            <div>
              <h1 className="po-doc-title">BRIEF CRÉATIF VIDÉO (UGC & ADS)</h1>
              <div className="po-doc-ref">Produit : <strong>{product.produit}</strong></div>
              <div className="po-doc-date">Prix de Vente : {formatFCFA(Number(product.vente) || 0)} · Cible : {product.cible || 'Grand public'}</div>
            </div>
            <div className="po-doc-status-badge" style={{ background: '#FFF8E0', color: '#7A6220' }}>
              3 Scripts Inclus
            </div>
          </div>

          {/* Scripts list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {scripts.map((sc, idx) => (
              <div key={sc.id} style={{ background: '#FAF8F2', border: '1px solid var(--panel-line)', borderRadius: '6px', padding: '14px' }}>
                <h3 style={{ fontFamily: 'Georgia', fontSize: '15px', margin: '0 0 6px', color: '#1E1B14' }}>
                  {sc.title}
                </h3>
                <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#7A5A1E', marginBottom: '8px' }}>
                  <strong>Accroche (Hook) :</strong> {sc.hookHeadline}
                </div>

                <table className="po-doc-table" style={{ fontSize: '11.5px', marginTop: '6px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '110px' }}>Timing</th>
                      <th>Visuel à Filmer</th>
                      <th>Voix Off / Texte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sc.scenes.map((scene) => (
                      <tr key={scene.id}>
                        <td style={{ fontWeight: 600, color: '#666' }}>{scene.timing}</td>
                        <td>{scene.visual}</td>
                        <td style={{ fontWeight: 500 }}>{scene.audio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
