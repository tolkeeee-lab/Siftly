export type ColumnGroupKey = 'identification' | 'costs' | 'results' | 'scoring' | 'marketing';

export type TablePresetView = 'all' | 'financial' | 'scoring' | 'compact';

export type QuickFilterKey = 'all' | 'margin40' | 'score4' | 'bateau' | 'avion' | 'top3';

export type SortFieldKey =
  | 'seq'
  | 'produit'
  | 'concurrent'
  | 'sourcing'
  | 'poids'
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
