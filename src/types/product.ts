export type ImportMode = 'bateau' | 'avion';

export interface ProductScoreCriteria {
  douleur: number | '';
  nonres: number | '';
  etendue: number | '';
  impact: number | '';
  waouh: number | '';
  innovant: number | '';
  nonsaison: number | '';
  habitudes: number | '';
  poidsfacteur: number | '';
}

export interface ProductData extends ProductScoreCriteria {
  id: string;
  seq: number;
  produit: string;
  imgSrc?: string;
  creative?: string;
  alibaba?: string;
  siteweb?: string;
  marche?: string;
  concurrent: number | '';
  sourcing: number | '';
  poids: number | '';
  modeimport: ImportMode;
  tarifbateau: number | '';
  tarifavion: number | '';
  cac: number | '';
  livraison: number | '';
  vente: number | '';
  cible?: string;
  angle?: string;
}

export type ScoreFieldKey = keyof ProductScoreCriteria;

export interface RankCriterionOption {
  key: ScoreFieldKey | 'marge_extra';
  label: string;
  isExtra?: boolean;
}

export interface AppStats {
  count: number;
  avgNote: string;
  avgMargin: string;
  topNote: string;
  topTarget: string;
}
