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

export interface MarketAnalysisData {
  saturationScore: 'low' | 'medium' | 'high';       // Saturation du marché
  competitionLevel: 'low' | 'medium' | 'high';      // Niveau de concurrence pub
  audienceSizeMillion: number;                     // Taille audience estimée (en millions)
  viralFactorScore: number;                        // Score de viralité sur 10
  codReturnRisk: 'low' | 'medium' | 'high';         // Risque de retour COD
  seasonalityType: 'all_year' | 'rainy' | 'festive' | 'hot_season'; // Période idéale
  strategicVerdict: string;                        // Verdict & Feu tricolore
  targetCountries: string[];                       // Pays prioritaires (ex: Bénin, Côte d'Ivoire, etc.)
  keyBarrierToEntry: string;                       // Barrière à l'entrée
  recommendedAdAngle: string;                      // Angle pub recommandé
}

export interface ProductData extends ProductScoreCriteria {
  id: string;
  seq: number;
  produit: string;
  category?: string;                               // Catégorie / Niche du produit
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
  marketAnalysis?: MarketAnalysisData;             // Données d'analyse de marché poussée
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

export const PRODUCT_CATEGORIES = [
  'Maison & Confort',
  'Santé & Bien-être',
  'Beauté & Cosmétique',
  'High-Tech & Gadgets',
  'Cuisine & Électroménager',
  'Auto & Moto',
  'Sécurité & Surveillance',
  'Enfants & Bébés',
  'Mode & Accessoires',
  'Bricolage & Outillage',
  'Sport & Fitness',
  'Autre',
] as const;
