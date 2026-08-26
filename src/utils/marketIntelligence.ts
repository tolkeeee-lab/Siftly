import {
  ProductData,
  MarketAnalysisData,
  BuyerPersonaData,
  MarketProjectionsData,
  AdBenchmarksData,
  CustomerObjectionItem,
  ReviewsAndObjectionsData,
  SpyShortcutsData,
} from '../types/product';
import { calculateNoteFinale, calculateMargin, calculateCOGS } from './calculations';
import { formatFCFA } from './formatters';

export function getProductMarketAnalysis(product: ProductData): MarketAnalysisData {
  if (product.marketAnalysis) {
    return product.marketAnalysis;
  }

  const { noteNum: score } = calculateNoteFinale(product);
  const margin = calculateMargin(product);
  const cogs = calculateCOGS(product);
  const sellingPrice = Number(product.vente) || 15000;
  const name = (product.produit || '').toLowerCase();
  const weight = Number(product.poids) || 0.5;
  const category = product.category || 'Maison & Confort';

  // 1. Return Risk estimation
  let codReturnRisk: 'low' | 'medium' | 'high' = 'low';
  if (name.includes('robe') || name.includes('chaussure') || name.includes('pantalon') || name.includes('verre')) {
    codReturnRisk = 'high';
  } else if (weight > 2 || name.includes('liquide') || name.includes('creme')) {
    codReturnRisk = 'medium';
  }

  // 2. Viral Factor Score (out of 10)
  const waouh = Number(product.waouh) || 3;
  const innovant = Number(product.innovant) || 3;
  const viralFactorScore = Math.min(10, Math.max(4, Math.round(waouh * 1.2 + innovant * 0.8)));

  // 3. Market Saturation & Competition Level
  let saturationScore: 'low' | 'medium' | 'high' = 'low';
  let competitionLevel: 'low' | 'medium' | 'high' = 'low';
  const competitorCount = Number(product.concurrent) || 0;

  if (competitorCount > 5) {
    saturationScore = 'high';
    competitionLevel = 'high';
  } else if (competitorCount >= 2) {
    saturationScore = 'medium';
    competitionLevel = 'medium';
  } else {
    saturationScore = 'low';
    competitionLevel = 'low';
  }

  // 4. Audience TAM Size (Millions in West & Central Africa)
  let audienceSizeMillion = 4.5;
  if (name.includes('moustique') || name.includes('santé') || name.includes('douleur') || name.includes('maison')) {
    audienceSizeMillion = 8.5;
  } else if (name.includes('voiture') || name.includes('auto') || name.includes('moto')) {
    audienceSizeMillion = 4.2;
  } else if (name.includes('beauté') || name.includes('visage') || name.includes('cheveux')) {
    audienceSizeMillion = 6.8;
  }

  // 5. Seasonality
  let seasonalityType: 'all_year' | 'rainy' | 'festive' | 'hot_season' = 'all_year';
  if (name.includes('moustique') || name.includes('pluie') || name.includes('parapluie')) {
    seasonalityType = 'rainy';
  } else if (name.includes('noel') || name.includes('fête') || name.includes('cadeau')) {
    seasonalityType = 'festive';
  } else if (name.includes('ventilateur') || name.includes('climatiseur') || name.includes('chaleur')) {
    seasonalityType = 'hot_season';
  }

  // 6. Strategic Verdict
  let strategicVerdict = '🟢 FEU VERT : Excellent potentiel de scaling en COD avec marge nette solide.';
  if (margin < 3000) {
    strategicVerdict = '🔴 FEU ROUGE : Marge unitaire trop serrée pour absorber les coûts publicitaires et les retours livreurs.';
  } else if (saturationScore === 'high') {
    strategicVerdict = '🟡 FEU ORANGE : Forte concurrence. Vendre exclusivement en Pack Bundle 2-en-1 ou offre spéciale pour se démarquer.';
  } else if (score !== null && score < 25) {
    strategicVerdict = '🟡 FEU ORANGE : Score global modéré. Tester avec un budget publicitaire réduit (20 000 FCFA) avant achat de stock.';
  }

  // 7. Target Countries
  const targetCountries = [
    'Bénin (Cotonou / Calavi / Porto-Novo)',
    "Côte d'Ivoire (Abidjan / Bouaké)",
    'Sénégal (Dakar / Thiès)',
    'Togo (Lomé)',
    'Cameroun (Douala / Yaoundé)',
  ];

  // 8. Key Barrier & Ad Angle
  const keyBarrierToEntry = weight <= 0.4
    ? `🪶 Poids très léger (${weight} kg) : Idéal pour fret aérien express et transport moto sans friction.`
    : `⚖️ Poids de ${weight} kg : Attention au coût du fret aérien. Privilégier le groupage maritime pour préserver la marge nette.`;

  const recommendedAdAngle = viralFactorScore >= 7
    ? 'Vidéo TikTok Ads : Démonstration visuelle choc "Avant / Après" avec accroche dans les 3 premières secondes.'
    : 'Facebook Ads : Témoignage client axé sur la résolution d\'une douleur quotidienne avec offre Promo limitée.';

  // 9. PILLAR 1: Pourquoi ce produit doit être utilisé
  const reasonsToUse = `• Offre une solution rapide et sans effort à un besoin récurrent de la cible.
• Fait gagner un temps précieux au quotidien et améliore le confort domestique/personnel.
• Utilisation intuitive : prise en main immédiate sans compétences techniques requises.
• Alternative moderne et valorisante par rapport aux méthodes traditionnelles lentes ou fatigantes.`;

  // 10. PILLAR 2: Problèmes concrets résolus
  const problemsSolved = `• Élimine la frustration quotidienne liée à la méthode manuelle ou inefficace actuelle.
• Réduit les dépenses récurrentes en remplaçant des consommables jetables ou des services coûteux.
• Apporte un soulagement direct (douleur physique, perte de temps, inconfort thermique, stress ou insécurité).`;

  // 11. PILLAR 3: Pourquoi il vaut vraiment la peine
  const whyItsWorthIt = `• Excellente rentabilité unitaire : Marge nette estimée à ${formatFCFA(margin)} pour un prix de vente de ${formatFCFA(sellingPrice)}.
• Fort coefficient de valeur perçue : Le client a l'impression d'en avoir largement pour son argent.
• Facilité de vente en lot (Offre Duo / Pack Famille) permettant d'augmenter le panier moyen et d'absorber le coût livreur.`;

  // 12. PILLAR 4: Points d'attention & vigilance
  const criticalAttentionPoints = `• Poids & Colisage (${weight} kg) : ${weight > 1 ? '⚠️ Poids élevé, vérifier les frais de transitaire' : '✅ Poids léger adapté à la livraison moto'}.
• Fragilité : Exiger un emballage renforcé (papier bulle / carton rigide) pour éviter les casses lors des tournées de livraison.
• Prise & Alimentation : S'assurer de la compatibilité des prises électriques (norme européenne 220V utilisée en Afrique de l'Ouest).
• Contrôle Qualité usine : Tester 100% des pièces à la réception avant remise aux livreurs pour éviter les retours clients à la porte.`;

  // 13. PILLAR 5: Pourquoi il pourrait NE PAS marcher malgré tout
  const failureRisks = `• 💣 Risque 1 (Qualité fournisseur) : Si le produit tombe en panne après 3 jours ou présente un défaut d'usine, le taux de retour COD explosera (> 25%).
• 💣 Risque 2 (Démonstration pub ratée) : Si la vidéo n'illustre pas immédiatement la preuve visuelle du résultat, le CPA (coût d'acquisition) sera trop élevé.
• 💣 Risque 3 (Guerre des prix locale) : Si des boutiques locales ou concurrents vendent une copie bas de gamme à prix cassé au grand marché (Dantokpa / Adjamé / Sandaga).
• 💣 Risque 4 (Logistique & Livreurs) : ${weight > 1.5 ? 'Colis trop lourd ou encombrant, refus des livreurs à moto de le transporter' : 'Injoignabilité des clients lors de la confirmation téléphonique des commandes'}.`;

  // 14. BUYER PERSONA AVANCÉ
  let genderRatio = 'Mixte (50% H / 50% F)';
  let targetAge = '25 - 50 ans';
  let professionalCategory = 'Cadres, Commerçants, Fonctionnaires & Salariés urbains';
  let psychologicalTrigger = 'Soulagement immédiat, Gain de confort & Fierté familiale';

  if (category === 'Beauté & Cosmétique' || category === 'Mode & Accessoires') {
    genderRatio = 'Femmes (80%) / Hommes (20%)';
    targetAge = '20 - 45 ans';
    professionalCategory = 'Femmes actives, Entrepreneures, Étudiantes';
    psychologicalTrigger = 'Esthétique, Confiance en soi & Séduction';
  } else if (category === 'Auto & Moto' || category === 'Bricolage & Outillage') {
    genderRatio = 'Hommes (85%) / Femmes (15%)';
    targetAge = '28 - 55 ans';
    professionalCategory = 'Propriétaires de véhicules, Chauffeurs, Artisans';
    psychologicalTrigger = 'Sécurité, Entretien & Économie de garage';
  } else if (category === 'Cuisine & Électroménager') {
    genderRatio = 'Femmes (75%) / Hommes (25%)';
    targetAge = '25 - 55 ans';
    professionalCategory = 'Mères de famille, Passionnées de cuisine, Travailleuses';
    psychologicalTrigger = 'Gain de temps en cuisine & Repas sains';
  }

  const buyerPersona: BuyerPersonaData = {
    targetAge,
    genderRatio,
    professionalCategory,
    psychologicalTrigger,
  };

  // 15. PROJECTIONS FINANCIÈRES & PÉNÉTRATION
  const conservativeUnits = Math.round(audienceSizeMillion * 1000 * 0.0003); // ~0.03% pénétration
  const conservativeRevenueFCFA = conservativeUnits * sellingPrice;
  const conservativeProfitFCFA = conservativeUnits * margin;

  const aggressiveUnits = Math.round(audienceSizeMillion * 1000 * 0.0012); // ~0.12% pénétration
  const aggressiveRevenueFCFA = aggressiveUnits * sellingPrice;
  const aggressiveProfitFCFA = aggressiveUnits * margin;

  const marketProjections: MarketProjectionsData = {
    conservativeUnits: Math.max(150, conservativeUnits),
    conservativeRevenueFCFA: Math.max(150 * sellingPrice, conservativeRevenueFCFA),
    conservativeProfitFCFA: Math.max(150 * margin, conservativeProfitFCFA),
    aggressiveUnits: Math.max(600, aggressiveUnits),
    aggressiveRevenueFCFA: Math.max(600 * sellingPrice, aggressiveRevenueFCFA),
    aggressiveProfitFCFA: Math.max(600 * margin, aggressiveProfitFCFA),
  };

  // 16. BENCHMARKS MÉDIAS PUBS
  const estimatedCPMFCFA = 1600; // 1 600 FCFA pour 1000 impressions en Afrique de l'Ouest
  const targetCTR = viralFactorScore >= 7 ? 3.2 : 2.4;
  const targetConversionRate = 11.5; // 11.5% de conversion sur la Landing Page
  const maxAllowedCPAFCFA = Math.max(2000, Math.round(margin * 0.45)); // CPA plafond avant risque

  const adBenchmarks: AdBenchmarksData = {
    estimatedCPMFCFA,
    targetCTR,
    targetConversionRate,
    maxAllowedCPAFCFA,
  };

  // 17. SYNTHÈSE AVIS MONDIAUX & OBJECTIONS COD
  const topPositiveReviews = `• ⭐ Facilité et rapidité d'utilisation : Les clients soulignent la simplicité de prise en main.
• ⭐ Excellent rapport qualité/prix perçu par rapport aux solutions classiques locales.
• ⭐ Efficacité visible dès la première utilisation (fort effet waouh avant/après).`;

  const topNegativeComplaints = `• ⚠️ Notice d'utilisation souvent uniquement en anglais ou chinois (fournir un guide WhatsApp en français).
• ⚠️ Fragilité des petits accessoires en plastique si manipulation brutale par le client.
• ⚠️ Autonomie ou puissance légèrement inférieure aux attentes si non branché ou rechargé à fond.`;

  const commonObjections: CustomerObjectionItem[] = [
    {
      objection: 'Est-ce que ça fonctionne vraiment ou c\'est une arnaque vue sur Internet ?',
      responseScript: '« Oui rassurez-vous ! Nous sommes une entreprise basée localement. Vous avez la garantie de tester et vérifier l\'article avec notre livreur avant de payer un seul franc (Paiement à la livraison 100% sécurisé). »',
    },
    {
      objection: 'C\'est un peu trop cher, j\'ai vu un modèle ressemblant au marché à moindre coût.',
      responseScript: '« Attention aux imitations bas de gamme du marché qui grillent après 3 jours sans garantie. Notre modèle est la version d\'origine certifiée avec moteur renforcé et garantie d\'échange express sous 48h. »',
    },
    {
      objection: 'Et si l\'appareil se gâte après quelques jours d\'utilisation ?',
      responseScript: '« Vous bénéficiez de notre garantie SAV de remplacement immédiat. En cas de moindre souci technique, notre service client basé en ville vous renvoie une pièce neuve gratuitement. »',
    },
    {
      objection: 'Je veux ouvrir le carton et vérifier avant de remettre l\'argent au livreur.',
      responseScript: '« Absolument ! Nos livreurs ont pour consigne de vous laisser vérifier la conformité du produit avant encaissement. »',
    },
  ];

  const reviewsAndObjections: ReviewsAndObjectionsData = {
    topPositiveReviews,
    topNegativeComplaints,
    commonObjections,
  };

  // 18. RACCOURCIS D'ESPIONNAGE 1-CLIC
  const queryParam = encodeURIComponent(product.produit || 'gadget');
  const spyShortcuts: SpyShortcutsData = {
    facebookAdsUrl: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${queryParam}&search_type=keyword_unordered&media_type=all`,
    tiktokSearchUrl: `https://www.tiktok.com/search?q=${queryParam}`,
    aliexpressReviewsUrl: `https://www.aliexpress.com/wholesale?SearchText=${queryParam}`,
    amazonReviewsUrl: `https://www.amazon.com/s?k=${queryParam}`,
    googleTrendsUrl: `https://trends.google.com/trends/explore?q=${queryParam}`,
  };

  return {
    saturationScore,
    competitionLevel,
    audienceSizeMillion,
    viralFactorScore,
    codReturnRisk,
    seasonalityType,
    strategicVerdict,
    targetCountries,
    keyBarrierToEntry,
    recommendedAdAngle,
    reasonsToUse,
    problemsSolved,
    whyItsWorthIt,
    criticalAttentionPoints,
    failureRisks,
    buyerPersona,
    marketProjections,
    adBenchmarks,
    reviewsAndObjections,
    spyShortcuts,
  };
}

export function getCategoryIcon(category?: string): string {
  switch (category) {
    case 'Maison & Confort': return '🏠';
    case 'Santé & Bien-être': return '🩺';
    case 'Beauté & Cosmétique': return '💄';
    case 'High-Tech & Gadgets': return '⚡';
    case 'Cuisine & Électroménager': return '🍳';
    case 'Auto & Moto': return '🚗';
    case 'Sécurité & Surveillance': return '🛡️';
    case 'Enfants & Bébés': return '👶';
    case 'Mode & Accessoires': return '👗';
    case 'Bricolage & Outillage': return '🔨';
    case 'Sport & Fitness': return '🏋️';
    default: return '📦';
  }
}
