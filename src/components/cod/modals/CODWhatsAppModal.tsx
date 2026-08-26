'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ExternalLink, Bike, User } from 'lucide-react';
import { CODOrder } from '../../../types/codLogistics';
import {
  generateCustomerConfirmationMessage,
  generateLivreurDispatchMessage,
} from '../../../utils/codWhatsAppTemplates';

interface CODWhatsAppModalProps {
  order: CODOrder | null;
  target: 'customer' | 'livreur';
  isOpen: boolean;
  onClose: () => void;
}

export const CODWhatsAppModal: React.FC<CODWhatsAppModalProps> = ({
  order,
  target,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const isCustomer = target === 'customer';
  const message = isCustomer
    ? generateCustomerConfirmationMessage(order)
    : generateLivreurDispatchMessage(order);

  const phone = isCustomer ? order.customerPhone : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            {isCustomer ? (
              <User className="w-5 h-5 text-emerald-400" />
            ) : (
              <Bike className="w-5 h-5 text-purple-400" />
            )}
            <h2>
              {isCustomer
                ? `Confirmation Client — ${order.customerName}`
                : `Fiche de Course Livreur — ${order.orderNumber}`}
            </h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
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
            <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
          </button>
          {isCustomer && (
            <button type="button" className="btn-open-wa" onClick={handleOpenWhatsApp}>
              <ExternalLink className="w-4 h-4" />
              <span>Envoyer sur WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
