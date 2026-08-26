'use client';

import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { ExpenseItem, ExpenseCategory } from '../../../types/financeTypes';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('ads_facebook');
  const [description, setDescription] = useState('');
  const [amountFCFA, setAmountFCFA] = useState<number>(10000);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amountFCFA <= 0) return;

    onSaveExpense({
      category,
      description: description.trim(),
      amountFCFA,
      date,
    });

    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <DollarSign className="w-5 h-5 text-gold-deep" />
            <h2>Ajouter une Dépense / Charge</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="po-modal-form">
          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Catégorie de dépense</label>
              <select
                className="po-select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                <option value="ads_facebook">📣 Pub Facebook / Instagram Ads</option>
                <option value="ads_tiktok">🎵 Pub TikTok Ads</option>
                <option value="packaging">📦 Emballages, Cartons & Scotch</option>
                <option value="phone_internet">📱 Forfait Internet & Appels Clients</option>
                <option value="salary">👥 Salaires / Primes Closers & Équipe</option>
                <option value="rent_warehouse">🏢 Loyer / Stockage / Magasin</option>
                <option value="other">💼 Autres charges diverses</option>
              </select>
            </div>

            <div className="po-form-group flex-1">
              <label className="po-form-label">Date</label>
              <input
                type="date"
                className="po-text-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Description / Détail *</label>
              <input
                type="text"
                className="po-text-input"
                required
                placeholder="ex: Campagne TikTok Lampe Cotonou"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="po-form-group flex-1">
              <label className="po-form-label">Montant (FCFA) *</label>
              <input
                type="number"
                className="po-text-input bold text-gold-deep"
                required
                min="100"
                step="500"
                value={amountFCFA}
                onChange={(e) => setAmountFCFA(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="po-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-save-po">
              <Plus className="w-4 h-4" />
              <span>Enregistrer la Dépense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
