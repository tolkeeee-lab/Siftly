'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { useCODOrders } from '../../src/hooks/useCODOrders';
import { useFinanceJournal } from '../../src/hooks/useFinanceJournal';
import { calculatePnLStatement, calculateCashflowBreakdown } from '../../src/utils/financeCalculations';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { FinanceHeader } from '../../src/components/finances/FinanceHeader';
import { PnLSummaryCard } from '../../src/components/finances/PnLSummaryCard';
import { CashflowBreakdownCard } from '../../src/components/finances/CashflowBreakdownCard';
import { ExpenseJournalList } from '../../src/components/finances/ExpenseJournalList';
import { AddExpenseModal } from '../../src/components/finances/modals/AddExpenseModal';
import { PrintPnLModal } from '../../src/components/finances/modals/PrintPnLModal';

export default function FinancesPage() {
  const { products } = useProducts();
  const { orders } = useCODOrders();
  const { expenses, addExpense, deleteExpense } = useFinanceJournal();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isPrintPnLOpen, setIsPrintPnLOpen] = useState(false);

  // Consolidated P&L statement
  const pnl = useMemo(() => {
    return calculatePnLStatement(orders, products, expenses);
  }, [orders, products, expenses]);

  // Cashflow percentage breakdown
  const cashflowBreakdown = useMemo(() => {
    return calculateCashflowBreakdown(pnl);
  }, [pnl]);

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        <FinanceHeader
          pnl={pnl}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenPrintPnL={() => setIsPrintPnLOpen(true)}
        />

        {/* Cashflow Breakdown % Bar */}
        <CashflowBreakdownCard breakdown={cashflowBreakdown} />

        {/* Structured P&L Table */}
        <PnLSummaryCard pnl={pnl} />

        {/* Expense Journal */}
        <ExpenseJournalList
          expenses={expenses}
          onDeleteExpense={deleteExpense}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={addExpense}
      />

      <PrintPnLModal
        pnl={pnl}
        isOpen={isPrintPnLOpen}
        onClose={() => setIsPrintPnLOpen(false)}
      />
    </div>
  );
}
