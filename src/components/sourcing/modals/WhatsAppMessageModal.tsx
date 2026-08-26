'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import { PurchaseOrder } from '../../../types/purchaseOrder';
import { generateSupplierWhatsAppMessage } from '../../../utils/whatsappGenerator';

interface WhatsAppMessageModalProps {
  po: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppMessageModal: React.FC<WhatsAppMessageModalProps> = ({
  po,
  isOpen,
  onClose,
}) => {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !po) return null;

  const message = generateSupplierWhatsAppMessage(po, lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const phone = po.supplierContact?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h2>Message WhatsApp / WeChat — {po.orderNumber}</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="po-wa-controls">
          <div className="po-lang-toggle">
            <button
              type="button"
              className={`po-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              Anglais (Recommandé pour usines en Chine 🇨🇳)
            </button>
            <button
              type="button"
              className={`po-lang-btn ${lang === 'fr' ? 'active' : ''}`}
              onClick={() => setLang('fr')}
            >
              Français (Pour transitaire local)
            </button>
          </div>
        </div>

        <div className="po-wa-text-area">
          <pre>{message}</pre>
        </div>

        <div className="po-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn-copy-wa" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Message copié !' : 'Copier le message'}</span>
          </button>
          <button type="button" className="btn-open-wa" onClick={handleOpenWhatsApp}>
            <ExternalLink className="w-4 h-4" />
            <span>Ouvrir dans WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
