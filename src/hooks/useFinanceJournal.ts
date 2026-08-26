'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExpenseItem } from '../types/financeTypes';

const EXPENSES_STORAGE_KEY = 'siftly_expenses_journal_v1';

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: 'exp-1', date: new Date().toISOString().split('T')[0], category: 'ads_facebook', description: 'Campagne Cotonou Test', amountFCFA: 15000 },
  { id: 'exp-2', date: new Date().toISOString().split('T')[0], category: 'packaging', description: 'Lot 100 cartons emballage', amountFCFA: 6000 },
  { id: 'exp-3', date: new Date().toISOString().split('T')[0], category: 'phone_internet', description: 'Forfait 4G + Appels clients', amountFCFA: 5000 },
];

export function useFinanceJournal() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not read expenses from storage', e);
      }
    }
    return DEFAULT_EXPENSES;
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const saveExpenses = useCallback((newExpenses: ExpenseItem[]) => {
    setExpenses(newExpenses);
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(newExpenses));
    } catch (e) {
      console.warn('Could not save expenses to storage', e);
    }
  }, []);

  const addExpense = useCallback((item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    const updated = [newItem, ...expenses];
    saveExpenses(updated);
    return newItem;
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback((id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  return {
    expenses,
    isLoaded,
    addExpense,
    deleteExpense,
  };
}
