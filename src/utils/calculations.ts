import { ProductData, AppStats } from '../types/product';
import { parseNum, formatFCFA } from './formatters';

export const SCORE_KEYS: Array<keyof ProductData> = [
  'douleur',
  'nonres',
  'etendue',
  'impact',
  'waouh',
  'innovant',
  'nonsaison',
  'habitudes',
  'poidsfacteur',
];

export function calculateFreightCost(product: ProductData): number {
  const poids = parseNum(product.poids);
  const mode = product.modeimport || 'bateau';
  const rate = mode === 'avion' ? parseNum(product.tarifavion) : parseNum(product.tarifbateau);
  return poids * rate;
}

export function calculateCOGS(product: ProductData): number {
  const sourcing = parseNum(product.sourcing);
  const freight = calculateFreightCost(product);
  const cac = parseNum(product.cac);
  const livraison = parseNum(product.livraison);
  return sourcing + freight + cac + livraison;
}

export function calculateMargin(product: ProductData): number {
  const vente = parseNum(product.vente);
  const cogs = calculateCOGS(product);
  return vente - cogs;
}

export function calculateMarginPct(product: ProductData): number {
  const vente = parseNum(product.vente);
  if (vente <= 0) return 0;
  const margin = calculateMargin(product);
  return (margin / vente) * 100;
}

export function calculateNoteFinale(product: ProductData): { noteNum: number | null; noteText: string } {
  let sum = 0;
  let count = 0;
  SCORE_KEYS.forEach((key) => {
    const val = product[key];
    if (val !== '' && val !== undefined && val !== null) {
      const parsed = parseFloat(String(val));
      if (!isNaN(parsed)) {
        sum += parsed;
        count++;
      }
    }
  });
  if (count === 0) return { noteNum: null, noteText: '—' };
  const avg = sum / count;
  return { noteNum: avg, noteText: avg.toFixed(1) + '/5' };
}

export function calculateAppStats(products: ProductData[]): AppStats {
  if (!products.length) {
    return { count: 0, avgNote: '—', avgMargin: '—', topNote: '—', topTarget: '—' };
  }

  const notes: number[] = [];
  const margins: number[] = [];
  const targets: Record<string, number> = {};

  products.forEach((p) => {
    const { noteNum } = calculateNoteFinale(p);
    if (noteNum !== null) notes.push(noteNum);

    const margin = calculateMargin(p);
    margins.push(margin);

    const target = p.cible?.trim();
    if (target) {
      targets[target] = (targets[target] || 0) + 1;
    }
  });

  const avgNote = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) + '/5' : '—';
  const avgMargin = margins.length ? formatFCFA(margins.reduce((a, b) => a + b, 0) / margins.length) : '—';
  const topNote = notes.length ? Math.max(...notes).toFixed(1) + '/5' : '—';

  let topTarget = '—';
  let maxCount = 0;
  Object.entries(targets).forEach(([t, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      topTarget = t;
    }
  });

  return {
    count: products.length,
    avgNote,
    avgMargin,
    topNote,
    topTarget,
  };
}
