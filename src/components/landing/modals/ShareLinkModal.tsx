'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Globe } from 'lucide-react';
import { ProductData } from '../../../types/product';

interface ShareLinkModalProps {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${product.id}`
    : `https://siftly-iota.vercel.app/p/${product.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPage = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Globe className="w-5 h-5 text-gold-deep" />
            <h2>Lien Public de Votre Page de Vente</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="share-modal-body">
          <p style={{ fontSize: '13px', color: '#444', margin: '0 0 12px', lineHeight: 1.4 }}>
            Insérez ce lien direct dans vos campagnes <strong>TikTok Ads</strong>, <strong>Facebook Ads</strong> ou dans votre <strong>Bio Instagram</strong>. Vos clients pourront commander en 10 secondes et vous recevrez les commandes directement dans le <strong>Suivi COD</strong> !
          </p>

          <div className="share-link-input-box">
            <input
              type="text"
              readOnly
              className="share-url-in"
              value={publicUrl}
            />
            <button type="button" className="btn-copy-url" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        <div className="po-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn-open-wa" onClick={handleOpenPage}>
            <ExternalLink className="w-4 h-4" />
            <span>Tester la Page Public</span>
          </button>
        </div>
      </div>
    </div>
  );
};
