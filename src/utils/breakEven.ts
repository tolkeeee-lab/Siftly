import { ProductData } from '../types/product';
import { calculateCOGS, calculateMargin } from './calculations';

export interface BreakEvenResult {
  unitCOGS: number;
  unitPrice: number;
  unitMargin: number;
  marginPct: number;
  batchUnits: number;
  fixedAdBudget: number;
  dailyFixedCosts: number;
  targetDaysToSell: number;
  deliverySuccessRate: number;
  returnFee: number;
  
  // Base Break-Even
  totalInitialInvestment: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  sellThroughPctNeeded: number;
  potentialProfitAtFullSell: number;
  isProfitable: boolean;

  // Daily target
  dailySalesForStock: number;
  dailySalesForBreakEven: number;

  // Real COD metrics (Cash on Delivery West Africa)
  codDeliveredUnits: number;
  codFailedUnits: number;
  codAverageNetMarginPerAttempt: number;
  codTotalNetProfit: number;
  codBreakEvenUnits: number;
}

export function calculateBreakEven(
  product: ProductData,
  initialBatchQty = 50,
  fixedAdBudget = 50000,
  dailyFixedCosts = 5000,
  targetDaysToSell = 20,
  deliverySuccessRate = 80, // in % (80% standard in West Africa)
  returnFee = 1000 // Return fee paid to courier on failed attempt
): BreakEvenResult {
  const unitCOGS = calculateCOGS(product);
  const unitPrice = parseFloat(String(product.vente)) || 0;
  const unitMargin = calculateMargin(product);
  const marginPct = unitPrice > 0 ? (unitMargin / unitPrice) * 100 : 0;
  const cac = parseFloat(String(product.cac)) || 0;

  const sourcing = parseFloat(String(product.sourcing)) || 0;
  const freight = unitCOGS - sourcing - cac - (parseFloat(String(product.livraison)) || 0);

  // Total initial cash outlay before starting sales
  const totalFixedCharges = fixedAdBudget + (dailyFixedCosts * targetDaysToSell);
  const totalInitialInvestment = (sourcing + freight) * initialBatchQty + totalFixedCharges;

  const isProfitable = unitMargin > 0;
  const breakEvenUnits = isProfitable ? Math.ceil(totalInitialInvestment / unitMargin) : Infinity;
  const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * unitPrice : 0;
  const sellThroughPctNeeded =
    initialBatchQty > 0 && isFinite(breakEvenUnits)
      ? Math.round((breakEvenUnits / initialBatchQty) * 100)
      : 0;

  const totalRevenueAtFullSell = initialBatchQty * unitPrice;
  const totalCostAtFullSell = initialBatchQty * unitCOGS + totalFixedCharges;
  const potentialProfitAtFullSell = totalRevenueAtFullSell - totalCostAtFullSell;

  // Daily targets
  const dailySalesForStock = targetDaysToSell > 0 ? Number((initialBatchQty / targetDaysToSell).toFixed(1)) : 0;
  const dailySalesForBreakEven =
    targetDaysToSell > 0 && isFinite(breakEvenUnits)
      ? Number((breakEvenUnits / targetDaysToSell).toFixed(1))
      : 0;

  // Real COD Analysis
  const deliveryRateFrac = Math.max(0.1, Math.min(1, deliverySuccessRate / 100));
  const failedRateFrac = 1 - deliveryRateFrac;

  // On successful delivery: earn unitMargin
  // On failed delivery: lose CAC + return delivery fee (product returns to stock)
  const codAverageNetMarginPerAttempt =
    (deliveryRateFrac * unitMargin) - (failedRateFrac * (cac + returnFee));

  // To deliver initialBatchQty units with deliverySuccessRate%:
  const attemptsNeeded = Math.ceil(initialBatchQty / deliveryRateFrac);
  const codFailedUnits = attemptsNeeded - initialBatchQty;
  const codDeliveredUnits = initialBatchQty;

  const codTotalRevenue = codDeliveredUnits * unitPrice;
  const codProductAndFreightCost = (sourcing + freight) * codDeliveredUnits;
  const codTotalAdSpend = attemptsNeeded * cac + fixedAdBudget + (dailyFixedCosts * targetDaysToSell);
  const codTotalDeliveryCost = (codDeliveredUnits * (parseFloat(String(product.livraison)) || 0)) + (codFailedUnits * returnFee);
  
  const codTotalNetProfit = codTotalRevenue - codProductAndFreightCost - codTotalAdSpend - codTotalDeliveryCost;

  const codBreakEvenUnits =
    codAverageNetMarginPerAttempt > 0
      ? Math.ceil(totalInitialInvestment / codAverageNetMarginPerAttempt)
      : Infinity;

  return {
    unitCOGS,
    unitPrice,
    unitMargin,
    marginPct,
    batchUnits: initialBatchQty,
    fixedAdBudget,
    dailyFixedCosts,
    targetDaysToSell,
    deliverySuccessRate,
    returnFee,
    totalInitialInvestment,
    breakEvenUnits,
    breakEvenRevenue,
    sellThroughPctNeeded,
    potentialProfitAtFullSell,
    isProfitable,
    dailySalesForStock,
    dailySalesForBreakEven,
    codDeliveredUnits,
    codFailedUnits,
    codAverageNetMarginPerAttempt,
    codTotalNetProfit,
    codBreakEvenUnits,
  };
}
