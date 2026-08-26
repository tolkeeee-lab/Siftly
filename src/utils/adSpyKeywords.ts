/**
 * Smart E-Commerce Ad Spy Engine for African COD & International Markets
 * Formulates advanced Boolean search queries for Meta/Facebook Ads Library, TikTok & Google
 * based on psychological pain points, COD buyer hooks and generic benefit terms rather than OEM device names.
 */

export interface SmartAdSpyQueries {
  genericKeyword: string;
  painPointKeyword: string;
  
  // Facebook Ads Library Targeted Queries
  fbCodQuery: string;            // ex: "anti moustique" "paiement à la livraison"
  fbDeliveryQuery: string;       // ex: "anti moustique" "livraison gratuite"
  fbBenefitQuery: string;        // ex: "piqure moustique" "paludisme"
  fbExactQuery: string;          // ex: "Chasse-moustique à photocatalyseur"
  
  // Direct Facebook Ads Library URLs (Filtered on active ads, all countries)
  fbCodUrl: string;
  fbDeliveryUrl: string;
  fbBenefitUrl: string;
  fbExactUrl: string;
  
  // TikTok & Creative Center URLs
  tiktokViralUrl: string;
  tiktokDemoUrl: string;
  
  // Product Reviews & Spy
  aliexpressReviewsUrl: string;
  amazonReviewsUrl: string;
  googleTrendsUrl: string;
}

const NICHE_SPY_RULES: Record<string, { generic: string; pain: string; codTag?: string }> = {
  moustique: {
    generic: 'anti moustique',
    pain: 'piqure moustique dormir en paix',
    codTag: 'lampe anti moustique',
  },
  insecte: {
    generic: 'piege moustique',
    pain: 'chasser moustiques chambre',
    codTag: 'tueur moustique',
  },
  batterie: {
    generic: 'batterie secours',
    pain: 'panne batterie recharge rapide coupure',
    codTag: 'demarreur booster voiture',
  },
  booster: {
    generic: 'booster voiture',
    pain: 'demarrer batterie secours nuit',
    codTag: 'jump starter voiture',
  },
  posture: {
    generic: 'correcteur posture',
    pain: 'mal de dos colonne lombaire',
    codTag: 'ceinture dos droit',
  },
  ceinture: {
    generic: 'ceinture dos',
    pain: 'soulager douleurs lombaires',
    codTag: 'ceinture maintien posture',
  },
  hachoir: {
    generic: 'hachoir multifonction',
    pain: 'gagner du temps cuisine rapide',
    codTag: 'hachoir electrique sans fil',
  },
  mixeur: {
    generic: 'mini mixeur portable',
    pain: 'jus frais smoothie rapide bureau',
    codTag: 'mixeur rechargeable',
  },
  colle: {
    generic: 'colle etanche soudure',
    pain: 'fuite tuyau toiture reparation fissure',
    codTag: 'colle magique reparation',
  },
  souder: {
    generic: 'baguette soudure aluminium',
    pain: 'souder sans poste chalumeau',
    codTag: 'soudure basse temperature',
  },
  brosse: {
    generic: 'brosse lissante chauffante',
    pain: 'lissage cheveux sans bruler abimer',
    codTag: 'peigne chauffant cheveux',
  },
  epilateur: {
    generic: 'epilateur cristal sans douleur',
    pain: 'poils incarnes rasage peau douce',
    codTag: 'epilation indolore gommage',
  },
  imprimante: {
    generic: 'mini imprimante thermique',
    pain: 'imprimer photos cours sans encre bluetooth',
    codTag: 'imprimante de poche portable',
  },
  projecteur: {
    generic: 'mini projecteur cinema maison',
    pain: 'cinema salon ecran geant telephone',
    codTag: 'videoprojecteur portable wifi',
  },
  aspirateur: {
    generic: 'aspirateur sans fil voiture',
    pain: 'nettoyer poussieres miettes voiture maison',
    codTag: 'mini aspirateur portable',
  },
};

export function extractSmartAdSpyQueries(productName: string, category?: string): SmartAdSpyQueries {
  const clean = (productName || '').trim();
  const lower = clean.toLowerCase();

  let generic = clean;
  let pain = 'payer a la livraison';

  // Check matching niche keywords
  let matched = false;
  for (const [key, rule] of Object.entries(NICHE_SPY_RULES)) {
    if (lower.includes(key)) {
      generic = rule.generic;
      pain = rule.pain;
      matched = true;
      break;
    }
  }

  // If not matched, clean up technical brand junk
  if (!matched) {
    generic = clean
      .replace(/\b(baseus|ugreen|anker|hoco|xiaomi|oraimo|pro|max|plus|ultra|v2|v3|gr11|w35)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!generic) generic = clean;
    pain = `${generic} satisfait ou rembourse`;
  }

  const fbBase = 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&media_type=all&search_type=keyword_unordered&q=';

  const fbCodQuery = `"${generic}" "paiement à la livraison"`;
  const fbDeliveryQuery = `"${generic}" "livraison gratuite"`;
  const fbBenefitQuery = pain;
  const fbExactQuery = clean;

  return {
    genericKeyword: generic,
    painPointKeyword: pain,
    fbCodQuery,
    fbDeliveryQuery,
    fbBenefitQuery,
    fbExactQuery,
    fbCodUrl: `${fbBase}${encodeURIComponent(fbCodQuery)}`,
    fbDeliveryUrl: `${fbBase}${encodeURIComponent(fbDeliveryQuery)}`,
    fbBenefitUrl: `${fbBase}${encodeURIComponent(fbBenefitQuery)}`,
    fbExactUrl: `${fbBase}${encodeURIComponent(fbExactQuery)}`,
    tiktokViralUrl: `https://www.tiktok.com/search?q=${encodeURIComponent(generic + ' tiktokmademebuyit')}`,
    tiktokDemoUrl: `https://www.tiktok.com/search?q=${encodeURIComponent(generic + ' avant apres review')}`,
    aliexpressReviewsUrl: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(generic)}`,
    amazonReviewsUrl: `https://www.amazon.com/s?k=${encodeURIComponent(generic)}`,
    googleTrendsUrl: `https://trends.google.com/trends/explore?q=${encodeURIComponent(generic)}`,
  };
}
