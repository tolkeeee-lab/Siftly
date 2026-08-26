export type OfferModelType = 
  | 'volume_pack'      // 📦 Duo / Trio Remisé (1 pc, 2 pcs -20%, 3 pcs -30%)
  | 'bundle_cross_sell'// 🎁 Bundle 2-en-1 (Produit Principal + Produit Complémentaire Choisi)
  | 'bogo'             // 🔥 Achetez 2 = 1 OFFERT (Liquidation rapide & Buzz)
  | 'vip_guarantee';   // 💎 Pack VIP Sérénité (+ Garantie 30j & Priorité)

export interface OfferTier {
  title: string;           // ex: "1 Boîte Standard", "Pack Duo (Recommandé)"
  quantity: number;        // ex: 1, 2, 3
  salePriceFCFA: number;   // ex: 12000, 19900, 26900
  originalPriceFCFA: number; // ex: 15000, 24000, 36000
  discountPercent: number; // ex: 0, 17, 25
  badge?: string;          // ex: "Plus Populaire 🔥", "Meilleure Économie 💰"
  isFeatured?: boolean;
}

export interface OfferStructure {
  id: string;
  type: OfferModelType;
  title: string;
  badge: string;
  description: string;
  strategicAdvantage: string;
  tiers: OfferTier[];
  
  // Custom Bundle Target Info
  bundleProductId?: string;
  bundleProductName?: string;
  bundleProductCostFCFA?: number;
  bundleProductPriceFCFA?: number;
  isCustomized?: boolean;

  // Financial Simulation metrics (per 100 orders baseline with budget)
  averageOrderValueFCFA: number;     // Panier Moyen (AOV)
  cogsPerOrderFCFA: number;          // Coût d'Achat Moyen
  deliveryFeeFCFA: number;           // Frais de Livraison Moyen
  netMarginPerOrderFCFA: number;     // Marge Nette Avant Pub
  maxAllowableCACFCFA: number;       // CAC Max Toléré (Point mort)
  
  // Micro-budget test projections
  totalOrdersFromBudget: number;     // Commandes générées avec le budget test
  totalRevenueFCFA: number;          // Chiffre d'Affaires projeté
  totalNetProfitFCFA: number;        // Bénéfice Net en poche (après pub, stock, livraison)
  roasTarget: number;                // ROAS cible (ex: 2.8x)
  
  // Feasibility & Ease Score (0-100)
  easeScore: number;                 // Facilité d'exécution (100 = aucun accessoire supplémentaire)
  profitScore: number;               // Rentabilité financière
  overallRankScore: number;          // Score Global
  isRecommendedWinner?: boolean;     // Gagnant Recommandé
}

export interface OfferSimulationParams {
  productId: string;
  testAdBudgetFCFA: number;   // Budget pub test (ex: 30000 FCFA)
  initialStock: number;       // Stock de départ (ex: 20 pièces)
  targetCPAFCFA: number;      // Coût par achat estimé (ex: 2500 FCFA)
}
