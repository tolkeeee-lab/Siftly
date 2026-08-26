export type ScriptFormat =
  | 'problem_solution'   // Problème -> Solution (Douleur)
  | 'wow_demonstration'  // Démonstration Choc (Effet Waouh)
  | 'anti_counterfeit';  // Comparatif Qualité vs Marché Local

export interface ScriptScene {
  id: string;
  timing: string;      // ex: "0:00 - 0:03 (Hook)"
  visual: string;      // Ce que l'on voit à l'écran
  audio: string;       // Voix off / Texte affiché
  tip?: string;        // Conseil de tournage / cadrage
}

export interface VideoScript {
  id: string;
  format: ScriptFormat;
  title: string;
  hookHeadline: string;
  badge: string;
  scenes: ScriptScene[];
  callToAction: string;
}

export interface MarketingAngle {
  id: string;
  name: string;        // ex: "Angle Douleur & Frustration"
  icon: string;
  hook: string;        // Première phrase de la pub
  targetAudience: string;
  coreBenefit: string;
}

export interface MediaBuyingMetrics {
  sellingPriceFCFA: number;
  cogsFCFA: number;
  grossMarginFCFA: number;
  maxTargetCPAFCFA: number; // Coût par achat maximum recommandé
  breakEvenROAS: number;    // ROAS minimum à l'équilibre
  suggestedTestBudgetFCFA: number; // Budget test recommandé
  expectedOrdersForBudget: number; // Commandes attendues
  projectedNetProfitFCFA: number;  // Bénéfice net projeté
}
