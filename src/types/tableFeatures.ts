export type ColumnGroupKey = 'identification' | 'costs' | 'results' | 'scoring' | 'marketing';

export type TablePresetView = 'all' | 'financial' | 'scoring' | 'compact';

export type QuickFilterKey =
  | 'all'
  | 'weight_light'   // 🪶 Ultra-Léger (< 0.3 kg) - Idéal Avion & Moto
  | 'weight_medium'  // 📦 Standard (0.3 - 1.0 kg) - Format classique COD
  | 'weight_heavy'   // 🏋️ Lourd (> 1.0 kg) - Bateau recommandé
  | 'margin40'       // Marge ≥ 40%
  | 'score4'         // Note ≥ 4.0
  | 'bateau'         // Fret Maritime
  | 'avion'          // Fret Aérien
  | 'top3';          // Top 3 Gagnants

export type SortFieldKey =
  | 'seq'
  | 'produit'
  | 'category'
  | 'concurrent'
  | 'sourcing'
  | 'poids'          // Poids (kg) - Tri du moins lourd au plus lourd
  | 'cogs'
  | 'vente'
  | 'marge'
  | 'margepct'
  | 'note'
  | 'cac'
  | 'livraison'
  | 'douleur'
  | 'impact'
  | 'waouh';

export interface SortConfig {
  key: SortFieldKey;
  direction: 'asc' | 'desc';
}

export interface VisibleColumnGroups {
  identification: boolean;
  costs: boolean;
  results: boolean;
  scoring: boolean;
  marketing: boolean;
}
