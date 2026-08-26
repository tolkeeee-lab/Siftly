'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Calendar, Tag, Filter } from 'lucide-react';
import { ExpenseItem, ExpenseCategory } from '../../types/financeTypes';
import { getExpenseCategoryMeta } from '../../utils/financeCalculations';
import { formatFCFA } from '../../utils/formatters';

interface ExpenseJournalListProps {
  expenses: ExpenseItem[];
  onDeleteExpense: (id: string) => void;
  onOpenAddExpense: () => void;
}

export const ExpenseJournalList: React.FC<ExpenseJournalListProps> = ({
  expenses,
  onDeleteExpense,
  onOpenAddExpense,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === selectedCategory);

  return (
    <div className="expense-journal-card">
      <div className="expense-journal-header">
        <div>
          <h3 className="expense-journal-title">📝 Journal des Dépenses & Frais Généraux</h3>
          <p className="expense-journal-subtitle">
            Enregistrez vos dépenses quotidiennes (Pub Ads, forfaits, emballages) pour maintenir un P&L exact.
          </p>
        </div>

        <button type="button" className="btn-add-expense" onClick={onOpenAddExpense}>
          <Plus className="w-4 h-4" />
          <span>Ajouter une Dépense</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="expense-filter-strip">
        <button
          type="button"
          className={`exp-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Toutes ({expenses.length})
        </button>
        <button
          type="button"
          className={`exp-filter-btn ${selectedCategory === 'ads_facebook' || selectedCategory === 'ads_tiktok' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ads_facebook')}
        >
          Pub Ads 📣
        </button>
        <button
          type="button"
          className={`exp-filter-btn ${selectedCategory === 'packaging' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('packaging')}
        >
          Emballages 📦
        </button>
        <button
          type="button"
          className={`exp-filter-btn ${selectedCategory === 'phone_internet' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('phone_internet')}
        >
          Appels / Net 📱
        </button>
      </div>

      {/* List */}
      <div className="expense-items-list">
        {filteredExpenses.length === 0 ? (
          <div className="exp-empty-msg">Aucune dépense enregistrée dans cette catégorie.</div>
        ) : (
          filteredExpenses.map((exp) => {
            const meta = getExpenseCategoryMeta(exp.category);
            return (
              <div key={exp.id} className="expense-row">
                <div className="exp-left">
                  <span className="exp-cat-badge" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                    {meta.icon} {meta.label}
                  </span>
                  <strong className="exp-desc">{exp.description}</strong>
                  <span className="exp-date">
                    <Calendar className="w-3 h-3 inline mr-1" /> {exp.date}
                  </span>
                </div>

                <div className="exp-right">
                  <span className="exp-amount">- {formatFCFA(exp.amountFCFA)}</span>
                  <button
                    type="button"
                    className="rowdel"
                    title="Supprimer cette dépense"
                    onClick={() => onDeleteExpense(exp.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-700" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
