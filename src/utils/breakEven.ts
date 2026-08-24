import { ProductData } from '../types/product';
import { calculateCOGS, calculateMargin } from './calculations';

export interface BreakEvenResult {
  unitCOGS: number;
  unitPrice: number;
  unitMargin: number;
  marginPct: number;
  batchUnits: number;
  fixedAdBudget: number;
  totalInitialInvestment: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  sellThroughPctNeeded: number;
  potentialProfitAtFullSell: number;
  isProfitable: boolean;
}

export function calculateBreakEven(
  product: ProductData,
  initialBatchQty = 50,
  fixedAdBudget = 50000
): BreakEvenResult {
  const unitCOGS = calculateCOGS(product);
  const unitPrice = parseFloat(String(product.vente)) || 0;
  const unitMargin = calculateMargin(product);
  const marginPct = unitPrice > 0 ? (unitMargin / unitPrice) * 100 : 0;

  // Investment = (Sourcing + Freight) * Qty + Fixed Ad Budget + Delivery/CAC
  const sourcingPlusFreight = (parseFloat(String(product.sourcing)) || 0) + (unitCOGS - (parseFloat(String(product.sourcing)) || 0) - (parseFloat(String(product.cac)) || 0) - (parseFloat(String(product.livraison)) || 0));
  const totalInitialInvestment = sourcingPlusFreight * initialBatchQty + fixedAdBudget;

  const isProfitable = unitMargin > 0;
  const breakEvenUnits = isProfitable ? Math.ceil(totalInitialInvestment / unitMargin) : Infinity;
  const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * unitPrice : 0;
  const sellThroughPctNeeded = initialBatchQty > 0 && isFinite(breakEvenUnits)
    ? Math.round((breakEvenUnits / initialBatchQty) * 100)
    : 0;

  const totalRevenueAtFullSell = initialBatchQty * unitPrice;
  const totalCostAtFullSell = initialBatchQty * unitCOGS + fixedAdBudget;
  const potentialProfitAtFullSell = totalRevenueAtFullSell - totalCostAtFullSell;

  return {
    unitCOGS,
    unitPrice,
    unitMargin,
    marginPct,
    batchUnits: initialBatchQty,
    fixedAdBudget,
    totalInitialInvestment,
    breakEvenUnits,
    breakEvenRevenue,
    sellThroughPctNeeded,
    potentialProfitAtFullSell,
    isProfitable,
  };
}
