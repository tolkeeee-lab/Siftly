import { CODOrder } from '../types/codLogistics';
import { ProductData } from '../types/product';
import { ExpenseItem, ExpenseCategory, PnLStatement, CashflowBreakdownItem, ProductRevenueItem } from '../types/financeTypes';
import { calculateCOGS } from './calculations';

export function getExpenseCategoryMeta(cat: ExpenseCategory): { label: string; icon: string; color: string } {
  switch (cat) {
    case 'ads_facebook':
      return { label: 'Pub Facebook / Meta', icon: '📣', color: '#1877F2' };
    case 'ads_tiktok':
      return { label: 'Pub TikTok Ads', icon: '🎵', color: '#FE2C55' };
    case 'packaging':
      return { label: 'Emballage & Cartons', icon: '📦', color: '#D97706' };
    case 'phone_internet':
      return { label: 'Appels & Internet', icon: '📱', color: '#059669' };
    case 'salary':
      return { label: 'Salaires & Closers', icon: '👥', color: '#7C3AED' };
    case 'rent_warehouse':
      return { label: 'Loyer & Magasin', icon: '🏢', color: '#4B5563' };
    default:
      return { label: 'Autres charges', icon: '💼', color: '#6B7280' };
  }
}

export function calculatePnLStatement(
  orders: CODOrder[],
  products: ProductData[],
  expenses: ExpenseItem[]
): PnLStatement {
  // 1. Revenue & delivered orders
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  const grossRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalPriceFCFA || 0), 0);
  const totalDeliveredUnits = deliveredOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const pipelineRevenue = pendingOrders.reduce((sum, o) => sum + (o.totalPriceFCFA || 0), 0);

  // 2. COGS (Sourcing + freight per item)
  let cogs = 0;
  deliveredOrders.forEach((o) => {
    const prod = products.find((p) => p.id === o.productId || p.produit === o.productName);
    const unitCOGS = prod ? calculateCOGS(prod) : Math.round((o.totalPriceFCFA || 15000) * 0.35);
    cogs += unitCOGS * (o.quantity || 1);
  });

  const grossProfit = grossRevenue - cogs;
  const grossMarginPct = grossRevenue > 0 ? Math.round((grossProfit / grossRevenue) * 1000) / 10 : 0;

  // 3. Operating Expenses
  let totalAdSpend = 0;
  let totalGeneralExpenses = 0;

  expenses.forEach((e) => {
    if (e.category === 'ads_facebook' || e.category === 'ads_tiktok') {
      totalAdSpend += e.amountFCFA || 0;
    } else {
      totalGeneralExpenses += e.amountFCFA || 0;
    }
  });

  const totalDeliveryFees = deliveredOrders.reduce((sum, o) => sum + (o.deliveryFeeFCFA || 0), 0);
  const totalReturnLosses = cancelledOrders.length * 500; // 500 F par retour en moyenne

  const totalOperatingExpenses = totalAdSpend + totalDeliveryFees + totalReturnLosses + totalGeneralExpenses;

  // 4. Net Profit & Margin
  const netProfit = grossProfit - totalOperatingExpenses;
  const netMarginPct = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 1000) / 10 : 0;

  return {
    grossRevenueFCFA: grossRevenue,
    totalDeliveredUnits,
    totalDeliveredOrders: deliveredOrders.length,
    totalPendingOrders: pendingOrders.length,
    pipelineRevenueFCFA: pipelineRevenue,
    cogsFCFA: cogs,
    grossProfitFCFA: grossProfit,
    grossMarginPct,
    totalAdSpendFCFA: totalAdSpend,
    totalDeliveryFeesFCFA: totalDeliveryFees,
    totalReturnLossesFCFA: totalReturnLosses,
    totalGeneralExpensesFCFA: totalGeneralExpenses,
    totalOperatingExpensesFCFA: totalOperatingExpenses,
    netProfitFCFA: netProfit,
    netMarginPct,
  };
}

export function calculateProductRevenueBreakdown(
  orders: CODOrder[],
  products: ProductData[]
): ProductRevenueItem[] {
  const globalDeliveredRev = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalPriceFCFA || 0), 0) || 1;

  // Group by product
  const items: ProductRevenueItem[] = products.map((prod) => {
    const prodOrders = orders.filter(
      (o) => o.productId === prod.id || o.productName === prod.produit
    );

    const totalOrdersCount = prodOrders.length;
    const deliveredOrders = prodOrders.filter((o) => o.status === 'delivered');
    const cancelledOrders = prodOrders.filter((o) => o.status === 'cancelled');

    const deliveredOrdersCount = deliveredOrders.length;
    const cancelledOrdersCount = cancelledOrders.length;
    const deliveryRatePct = totalOrdersCount > 0
      ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100)
      : 0;

    const deliveredRevenueFCFA = deliveredOrders.reduce((sum, o) => sum + (o.totalPriceFCFA || 0), 0);
    const deliveredUnitsCount = deliveredOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);

    const unitCOGS = calculateCOGS(prod);
    const cogsFCFA = deliveredUnitsCount * unitCOGS;
    const deliveryFeesFCFA = deliveredOrders.reduce((sum, o) => sum + (o.deliveryFeeFCFA || 0), 0);
    const returnLossesFCFA = cancelledOrdersCount * 500;

    const netProfitFCFA = deliveredRevenueFCFA - cogsFCFA - deliveryFeesFCFA - returnLossesFCFA;
    const pctOfGlobalRevenue = Math.round((deliveredRevenueFCFA / globalDeliveredRev) * 100);

    return {
      productId: prod.id,
      productName: prod.produit || 'Sans titre',
      productImg: prod.imgSrc,
      totalOrdersCount,
      deliveredOrdersCount,
      cancelledOrdersCount,
      deliveryRatePct,
      deliveredRevenueFCFA,
      deliveredUnitsCount,
      cogsFCFA,
      deliveryFeesFCFA,
      returnLossesFCFA,
      netProfitFCFA,
      pctOfGlobalRevenue,
    };
  });

  // Sort by delivered revenue descending
  return items.sort((a, b) => b.deliveredRevenueFCFA - a.deliveredRevenueFCFA);
}

export function calculateCashflowBreakdown(pnl: PnLStatement): CashflowBreakdownItem[] {
  const rev = pnl.grossRevenueFCFA || 1;

  return [
    {
      label: 'Coût Marchandises (COGS)',
      amountFCFA: pnl.cogsFCFA,
      pctOfRevenue: Math.max(0, Math.round((pnl.cogsFCFA / rev) * 100)),
      color: '#D97706',
      icon: '🛍️',
    },
    {
      label: 'Budget Pub (Facebook / TikTok)',
      amountFCFA: pnl.totalAdSpendFCFA,
      pctOfRevenue: Math.max(0, Math.round((pnl.totalAdSpendFCFA / rev) * 100)),
      color: '#2563EB',
      icon: '📣',
    },
    {
      label: 'Frais Livraison & Retours COD',
      amountFCFA: pnl.totalDeliveryFeesFCFA + pnl.totalReturnLossesFCFA,
      pctOfRevenue: Math.max(0, Math.round(((pnl.totalDeliveryFeesFCFA + pnl.totalReturnLossesFCFA) / rev) * 100)),
      color: '#7C3AED',
      icon: '🛵',
    },
    {
      label: 'Charges d’Exploitation Diverses',
      amountFCFA: pnl.totalGeneralExpensesFCFA,
      pctOfRevenue: Math.max(0, Math.round((pnl.totalGeneralExpensesFCFA / rev) * 100)),
      color: '#4B5563',
      icon: '📦',
    },
    {
      label: 'BÉNÉFICE NET EN POCHE',
      amountFCFA: pnl.netProfitFCFA,
      pctOfRevenue: Math.max(0, Math.round((pnl.netProfitFCFA / rev) * 100)),
      color: pnl.netProfitFCFA >= 0 ? '#059669' : '#DC2626',
      icon: '💰',
    },
  ];
}
