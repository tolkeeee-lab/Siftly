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

export interface BuyerPersonaData {
  targetAge: string;                               // ex: "25 - 45 ans"
  genderRatio: string;                             // ex: "Femmes 70% / Hommes 30%"
  professionalCategory: string;                    // ex: "Employés de bureau, Commerçants, Femmes au foyer"
  psychologicalTrigger: string;                    // ex: "Soulagement immédiat, Fierté sociale, Confort familial"
}

export interface MarketProjectionsData {
  conservativeUnits: number;                       // Hypothèse Prudente (0.05% pénétration)
  conservativeRevenueFCFA: number;
  conservativeProfitFCFA: number;
  aggressiveUnits: number;                         // Hypothèse Scaling Agressif (0.20% pénétration)
  aggressiveRevenueFCFA: number;
  aggressiveProfitFCFA: number;
}

export interface AdBenchmarksData {
  estimatedCPMFCFA: number;                        // Coût pour 1000 impressions (ex: 1500 FCFA)
  targetCTR: number;                               // Taux de clic cible vidéo (ex: 2.8%)
  targetConversionRate: number;                    // Taux de conversion Landing COD (ex: 10.5%)
  maxAllowedCPAFCFA: number;                       // CPA Plafond avant perte (ex: 3500 FCFA)
}

export interface CustomerObjectionItem {
  objection: string;                               // ex: "Est-ce que ça fonctionne vraiment ou c'est de l'arnaque ?"
  responseScript: string;                          // Script prêt à l'emploi pour appel/WhatsApp
}

export interface ReviewsAndObjectionsData {
  topPositiveReviews: string;                      // Ce que les acheteurs adorent (Synthèse 5 étoiles)
  topNegativeComplaints: string;                   // Ce qui énerve les acheteurs (Plaintes & Retours 1 étoile)
  commonObjections: CustomerObjectionItem[];       // Top Objections & Réponses
}

export interface SpyShortcutsData {
  facebookAdsUrl: string;                          // Lien Facebook Ad Library direct
  tiktokSearchUrl: string;                         // Lien TikTok Creative search direct
  aliexpressReviewsUrl: string;                    // Lien AliExpress avis photos direct
  amazonReviewsUrl: string;                        // Lien Amazon reviews direct
  googleTrendsUrl: string;                         // Lien Google Trends direct
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

  // 5 Piliers Stratégiques Poussés
  reasonsToUse: string;                            // 1. Pourquoi ce produit doit être utilisé (Usage & Bénéfices)
  problemsSolved: string;                          // 2. Les Problèmes concrets qu'il résout (Pain points)
  whyItsWorthIt: string;                           // 3. Pourquoi il vaut vraiment la peine (Rentabilité & Effet Waouh)
  criticalAttentionPoints: string;                 // 4. Points d'attention & vigilance (Qualité, Fret, Poids)
  failureRisks: string;                            // 5. Pourquoi il pourrait échouer malgré tout (Pièges cachés)

  // Données Ultra-Poussées Avancées
  buyerPersona?: BuyerPersonaData;                 // Profil Persona & Démographie Cible
  marketProjections?: MarketProjectionsData;       // Projections Financières & Pénétration
  adBenchmarks?: AdBenchmarksData;                 // Métriques Médias Publicitaires (Facebook / TikTok)
  reviewsAndObjections?: ReviewsAndObjectionsData; // Synthèse Avis & Objections Clients
  spyShortcuts?: SpyShortcutsData;                 // Liens d'espionnage 1-clic direct
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
