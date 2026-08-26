'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe, MessageCircle, Video, Share2 } from 'lucide-react';
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

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🔥 Découvrez l'offre spéciale sur *${product.produit || 'ce produit'}* avec paiement à la livraison : ${publicUrl}`
  )}`;

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Globe className="w-5 h-5 text-gold-deep" />
            <h2>Partager Votre Page de Vente Publique</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="share-modal-body">
          <p style={{ fontSize: '13px', color: '#444', margin: '0 0 12px', lineHeight: 1.45 }}>
            Voici le lien direct de votre produit. Tous les clients qui commandent sur cette page apparaîtront <strong>automatiquement dans votre onglet 🚚 Suivi COD</strong> !
          </p>

          {/* Direct URL Input */}
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

          {/* Direct 1-Click Share Buttons */}
          <div className="share-modal-grid">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="share-action-btn whatsapp"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Partager sur WhatsApp (Statut ou Client)</span>
            </a>

            <button type="button" className="share-action-btn tiktok" onClick={handleCopy}>
              <Video className="w-5 h-5" />
              <span>Copier pour TikTok Ads / Bio TikTok</span>
            </button>

            <button type="button" className="share-action-btn facebook" onClick={handleCopy}>
              <Share2 className="w-5 h-5" />
              <span>Copier pour Facebook Ads / Post Page</span>
            </button>
          </div>
        </div>

        <div className="po-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn-open-wa" onClick={handleOpenPage}>
            <ExternalLink className="w-4 h-4" />
            <span>Tester la Page Client</span>
          </button>
        </div>
      </div>
    </div>
  );
};
