'use client';

import React, { useState, useMemo } from 'react';
import { useProducts } from '../../src/hooks/useProducts';
import { useCODOrders } from '../../src/hooks/useCODOrders';
import { useFinanceJournal } from '../../src/hooks/useFinanceJournal';
import {
  calculatePnLStatement,
  calculateCashflowBreakdown,
  calculateProductRevenueBreakdown,
} from '../../src/utils/financeCalculations';
import { Masthead } from '../../src/components/header/Masthead';
import { NavigationTabs } from '../../src/components/navigation/NavigationTabs';
import { FinanceHeader } from '../../src/components/finances/FinanceHeader';
import { PnLSummaryCard } from '../../src/components/finances/PnLSummaryCard';
import { ProductRevenueBreakdownTable } from '../../src/components/finances/ProductRevenueBreakdownTable';
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

  // Consolidated Global P&L statement (Delivered Cash In Hand)
  const pnl = useMemo(() => {
    return calculatePnLStatement(orders, products, expenses);
  }, [orders, products, expenses]);

  // Per-product revenue & delivery breakdown
  const productBreakdown = useMemo(() => {
    return calculateProductRevenueBreakdown(orders, products);
  }, [orders, products]);

  // Cashflow percentage breakdown
  const cashflowBreakdown = useMemo(() => {
    return calculateCashflowBreakdown(pnl);
  }, [pnl]);

  return (
    <div className="sheet">
      <Masthead />
      <NavigationTabs />

      <div style={{ marginTop: '16px' }}>
        {/* Global Summary KPI Header */}
        <FinanceHeader
          pnl={pnl}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenPrintPnL={() => setIsPrintPnLOpen(true)}
        />

        {/* Cashflow Breakdown % Bar */}
        <CashflowBreakdownCard breakdown={cashflowBreakdown} />

        {/* Global Consolidated P&L Table */}
        <PnLSummaryCard pnl={pnl} />

        {/* Per-Product Delivered Revenue & Profit Breakdown */}
        <ProductRevenueBreakdownTable
          productItems={productBreakdown}
          globalGrossRevenueFCFA={pnl.grossRevenueFCFA}
        />

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
