import { MediaBuyingMetrics } from '../types/adsStudio';

export function calculateMediaBuyingMetrics(
  sellingPrice: number,
  cogs: number,
  deliveryRatePct: number = 80,
  returnFee: number = 1000,
  testBudget: number = 30000
): MediaBuyingMetrics {
  const pVente = Math.max(0, sellingPrice);
  const pCogs = Math.max(0, cogs);
  const grossMargin = pVente - pCogs;

  const tLivraison = Math.min(100, Math.max(10, deliveryRatePct)) / 100;
  
  // Max CPA : On ne veut pas dépasser 50% de la marge brute par tentative pour garder du bénéfice
  const maxTargetCPA = Math.max(500, Math.round(grossMargin * 0.45));

  // Break Even ROAS = Prix de Vente / Max CPA
  const breakEvenROAS = maxTargetCPA > 0 ? Math.round((pVente / maxTargetCPA) * 10) / 10 : 2.5;

  // Estimation pour le budget test
  const expectedOrders = maxTargetCPA > 0 ? Math.floor(testBudget / maxTargetCPA) : 0;
  
  // Delivered orders
  const deliveredOrders = Math.floor(expectedOrders * tLivraison);
  const returnedOrders = expectedOrders - deliveredOrders;

  // Projected Net Profit = (deliveredOrders * GrossMargin) - (returnedOrders * ReturnFee) - testBudget
  const projectedNetProfit = (deliveredOrders * grossMargin) - (returnedOrders * returnFee) - testBudget;

  return {
    sellingPriceFCFA: pVente,
    cogsFCFA: pCogs,
    grossMarginFCFA: grossMargin,
    maxTargetCPAFCFA: maxTargetCPA,
    breakEvenROAS: Math.max(1.2, breakEvenROAS),
    suggestedTestBudgetFCFA: testBudget,
    expectedOrdersForBudget: expectedOrders,
    projectedNetProfitFCFA: projectedNetProfit,
  };
}
