import { ProductData, ImportMode } from '../types/product';
import { normalizeKey, parseNum } from './formatters';

const LABEL_FIELD_MAP: Record<string, keyof ProductData> = {
  produit: 'produit',
  nom: 'produit',
  'nom du produit': 'produit',
  creative: 'creative',
  'lien creative': 'creative',
  alibaba: 'alibaba',
  'lien alibaba': 'alibaba',
  'site web': 'siteweb',
  siteweb: 'siteweb',
  site: 'siteweb',
  marche: 'marche',
  "marche d'origine": 'marche',
  image: 'imgSrc',
  photo: 'imgSrc',
  'prix concurrent': 'concurrent',
  concurrent: 'concurrent',
  'prix sourcing brut': 'sourcing',
  'prix sourcing': 'sourcing',
  sourcing: 'sourcing',
  poids: 'poids',
  'poids (kg)': 'poids',
  'mode expedition': 'modeimport',
  "mode d'expedition": 'modeimport',
  'mode import': 'modeimport',
  mode: 'modeimport',
  transport: 'modeimport',
  'tarif bateau': 'tarifbateau',
  'tarif bateau (f/kg)': 'tarifbateau',
  'prix bateau': 'tarifbateau',
  bateau: 'tarifbateau',
  'tarif avion': 'tarifavion',
  'tarif avion (f/kg)': 'tarifavion',
  'prix avion': 'tarifavion',
  avion: 'tarifavion',
  "cout d'acquisition client": 'cac',
  'cout acquisition client': 'cac',
  cac: 'cac',
  'livraison offerte': 'livraison',
  'livraison gratuite': 'livraison',
  livraison: 'livraison',
  'frais de livraison': 'livraison',
  'cout livraison': 'livraison',
  'prix de vente': 'vente',
  vente: 'vente',
  'douleur probleme': 'douleur',
  douleur: 'douleur',
  'niveau de douleur du probleme resolu': 'douleur',
  'cout non-resolution': 'nonres',
  'cout non resolution': 'nonres',
  'etendue marche cible': 'etendue',
  etendue: 'etendue',
  'impact avant/apres': 'impact',
  impact: 'impact',
  'effet waouh': 'waouh',
  waouh: 'waouh',
  'caractere innovant': 'innovant',
  innovant: 'innovant',
  'non-saisonnalite': 'nonsaison',
  'non saisonnalite': 'nonsaison',
  'habitudes conso': 'habitudes',
  habitudes: 'habitudes',
  'facteur poids': 'poidsfacteur',
  cible: 'cible',
  "angle d'attaque": 'angle',
  angle: 'angle',
};

export function parseTextSheet(text: string): Partial<ProductData>[] {
  const blocks = text.split(/\n\s*-{3,}\s*\n/g).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      const row: Partial<ProductData> = {};
      block.split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return;
        const rawKey = normalizeKey(line.slice(0, idx));
        const value = line.slice(idx + 1).trim();
        const field = LABEL_FIELD_MAP[rawKey];
        if (field && value) {
          if (field === 'modeimport') {
            const lowerVal = value.toLowerCase();
            row.modeimport = lowerVal.includes('avion') ? 'avion' : 'bateau';
          } else if (['sourcing', 'poids', 'concurrent', 'tarifbateau', 'tarifavion', 'cac', 'livraison', 'vente', 'douleur', 'nonres', 'etendue', 'impact', 'waouh', 'innovant', 'nonsaison', 'habitudes', 'poidsfacteur'].includes(field)) {
            (row as any)[field] = parseNum(value);
          } else {
            (row as any)[field] = value;
          }
        }
      });
      return row;
    })
    .filter((r) => Object.keys(r).length > 0);
}

export function parsePastedRows(text: string): Partial<ProductData>[] {
  const trimmed = text.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.filter((r) => r && typeof r === 'object' && Object.keys(r).length > 0);
    } catch {
      // Fallback to key-value sheet parsing
    }
  }
  return parseTextSheet(text);
}
