import { ProductData } from '../types/product';
import { ComparedProductMetric, ComparisonAnalysis } from '../types/compareTypes';
import { calculateCOGS, calculateMargin, calculateMarginPct, calculateNoteFinale, calculateFreightCost } from './calculations';
import { calculateBreakEven } from './breakEven';

export function calculateComparedMetrics(products: ProductData[]): ComparedProductMetric[] {
  if (!products || products.length === 0) return [];

  const raw = products.map((p) => {
    const cogs = calculateCOGS(p);
    const margin = calculateMargin(p);
    const marginPct = calculateMarginPct(p);
    const { noteNum } = calculateNoteFinale(p);
    const freight = calculateFreightCost(p);
    const breakEven = calculateBreakEven(p, 50, 50000, 5000, 20, 80, 1000);

    return {
      product: p,
      cogsFCFA: cogs,
      marginFCFA: margin,
      marginPct,
      noteNum: noteNum ?? 0,
      freightCostFCFA: freight,
      breakEvenDailySales: breakEven.dailySalesForStock,
    };
  });

  const maxMargin = Math.max(...raw.map((r) => r.marginFCFA));
  const maxScore = Math.max(...raw.map((r) => r.noteNum));
  const minBreakEven = Math.min(...raw.map((r) => r.breakEvenDailySales));

  return raw.map((r) => ({
    ...r,
    isBestMargin: r.marginFCFA === maxMargin && maxMargin > 0,
    isBestScore: r.noteNum === maxScore && maxScore > 0,
    isBestBreakEven: r.breakEvenDailySales === minBreakEven && minBreakEven > 0,
  }));
}

export function analyzeComparison(metrics: ComparedProductMetric[]): ComparisonAnalysis {
  if (!metrics || metrics.length === 0) {
    return {
      winnerProduct: null,
      highestMarginProduct: null,
      highestScoreProduct: null,
      lowestRiskProduct: null,
    };
  }

  // Winner is sorted by noteNum descending, then by marginPct descending
  const sorted = [...metrics].sort((a, b) => {
    if (b.noteNum !== a.noteNum) return b.noteNum - a.noteNum;
    return b.marginPct - a.marginPct;
  });

  const highestMargin = [...metrics].sort((a, b) => b.marginFCFA - a.marginFCFA)[0]?.product || null;
  const highestScore = [...metrics].sort((a, b) => b.noteNum - a.noteNum)[0]?.product || null;
  const lowestRisk = [...metrics].sort((a, b) => a.breakEvenDailySales - b.breakEvenDailySales)[0]?.product || null;

  return {
    winnerProduct: sorted[0]?.product || null,
    highestMarginProduct: highestMargin,
    highestScoreProduct: highestScore,
    lowestRiskProduct: lowestRisk,
  };
}
