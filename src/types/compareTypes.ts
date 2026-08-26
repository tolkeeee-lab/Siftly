import { ProductData } from './product';

export interface ComparedProductMetric {
  product: ProductData;
  cogsFCFA: number;
  marginFCFA: number;
  marginPct: number;
  noteNum: number;
  freightCostFCFA: number;
  breakEvenDailySales: number;
  isBestMargin: boolean;
  isBestScore: boolean;
  isBestBreakEven: boolean;
}

export interface ComparisonAnalysis {
  winnerProduct: ProductData | null;
  highestMarginProduct: ProductData | null;
  highestScoreProduct: ProductData | null;
  lowestRiskProduct: ProductData | null;
}
