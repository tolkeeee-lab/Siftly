import { ProductData, MarketAnalysisData } from '../types/product';
import { calculateNoteFinale, calculateMargin } from './calculations';

export function getProductMarketAnalysis(product: ProductData): MarketAnalysisData {
  if (product.marketAnalysis) {
    return product.marketAnalysis;
  }

  const { noteNum: score } = calculateNoteFinale(product);
  const margin = calculateMargin(product);
  const name = (product.produit || '').toLowerCase();
  const weight = Number(product.poids) || 0.5;

  // 1. Return Risk estimation (Fragile, multiple sizing vs compact gadget)
  let codReturnRisk: 'low' | 'medium' | 'high' = 'low';
  if (name.includes('robe') || name.includes('chaussure') || name.includes('pantalon') || name.includes('verre')) {
    codReturnRisk = 'high';
  } else if (weight > 2 || name.includes('liquide') || name.includes('creme')) {
    codReturnRisk = 'medium';
  }

  // 2. Viral Factor Score (out of 10)
  const waouh = Number(product.waouh) || 3;
  const innovant = Number(product.innovant) || 3;
  const viralFactorScore = Math.min(10, Math.max(4, Math.round((waouh * 1.2 + innovant * 0.8))));

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

  // 4. Audience TAM Size (Millions in West & Central Africa: BJ, CI, SN, CM, TG)
  let audienceSizeMillion = 3.5;
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
  let strategicVerdict = '🟢 FEU VERT : Fort potentiel de scaling rapide en COD !';
  if (margin < 3000) {
    strategicVerdict = '🔴 FEU ROUGE : Marge unitaire trop serrée pour absorber les retours et le CPA publicitaire.';
  } else if (saturationScore === 'high') {
    strategicVerdict = '🟡 FEU ORANGE : Marché très disputé. Vendre exclusivement en Pack Bundle 2-en-1 ou avec Offre BOGO pour écraser les concurrents.';
  } else if (score !== null && score < 25) {
    strategicVerdict = '🟡 FEU ORANGE : Score de désirabilité modéré. Tester avec un micro-budget de 20 000 FCFA avant commande de gros volume.';
  }

  // 7. Target Countries
  const targetCountries = ['Bénin (Cotonou / Calavi)', "Côte d'Ivoire (Abidjan)", 'Sénégal (Dakar)', 'Togo (Lomé)', 'Cameroun (Douala / Yaoundé)'];

  // 8. Barrier to entry & Recommended angle
  const keyBarrierToEntry = weight < 1
    ? 'Faible coût de fret aérien/bateau, accessible aux petits budgets.'
    : 'Poids élevé : privilégier le groupage maritime pour maximiser la marge nette.';

  const recommendedAdAngle = viralFactorScore >= 7
    ? 'Vidéo Démonstration Choc "Avant / Après" sur TikTok Ads'
    : 'Angle Problème & Douleur Quotidienne avec témoignage sur Facebook Ads';

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
