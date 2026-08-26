import { ProductData } from '../types/product';
import { LandingPageConfig } from '../types/landingTypes';

export function generateLandingConfig(product: ProductData | null): LandingPageConfig {
  const name = product?.produit?.trim() || 'Produit Révolutionnaire';
  const price = Number(product?.vente) || 15000;
  const originalPrice = Math.round(price * 1.5);
  const target = product?.cible?.trim() || 'toutes les familles et professionnels';
  const angle = product?.angle?.trim() || 'La solution indispensable pour simplifier votre quotidien en toute sérénité';

  return {
    productId: product?.id || 'default',
    title: name,
    hookHeadline: `Dites adieu aux tracas du quotidien grâce à ${name} !`,
    subHeadline: `${angle}. Conçu spécialement pour ${target}. Paiement sécurisé à la livraison partout au Bénin et en Côte d'Ivoire.`,
    heroImage: product?.imgSrc || '',
    sellingPriceFCFA: price,
    originalPriceFCFA: originalPrice,
    guaranteeDays: 7,
    offers: [
      {
        id: 'offer-1',
        name: '1 Article (Offre Découverte)',
        quantity: 1,
        priceFCFA: price,
        originalPriceFCFA: originalPrice,
      },
      {
        id: 'offer-2',
        name: 'Pack Duo (2 Articles)',
        quantity: 2,
        priceFCFA: Math.round(price * 1.8), // 10% de remise sur le duo
        originalPriceFCFA: originalPrice * 2,
        badge: '🔥 OFFRE RECOMMANDÉE (-20%)',
        isRecommended: true,
      },
      {
        id: 'offer-3',
        name: 'Pack Famille (3 Articles)',
        quantity: 3,
        priceFCFA: Math.round(price * 2.5), // grosse remise
        originalPriceFCFA: originalPrice * 3,
        badge: '⭐ MAX ÉCONOMIE (-30%)',
      },
    ],
    keyBenefits: [
      `✅ Efficacité immédiate prouvée dès la première utilisation`,
      `✅ Matériaux renforcés haute durabilité (Original Certifié)`,
      `✅ Simple d'utilisation, sans installation complexe ni réglages compliqués`,
      `✅ Zéro risque : Vous inspectez votre colis et vous payez uniquement à la livraison chez vous`,
      `✅ Garantie satisfait ou échangé pendant 7 jours avec assistance WhatsApp dédiée`,
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Mme Clarisse A.',
        city: 'Cotonou (Haie Vive)',
        rating: 5,
        comment: `Franchement je doutais au début mais le livreur est venu en 24h. Le produit fonctionne super bien, rien à voir avec les copies qu'on trouve au marché !`,
        date: 'Il y a 2 jours',
      },
      {
        id: 'rev-2',
        author: 'M. Ibrahim K.',
        city: 'Abidjan (Cocody)',
        rating: 5,
        comment: `Superbe qualité ! J'ai pris le pack duo pour offrir à ma mère. Très satisfait du service et du suivi sur WhatsApp.`,
        date: 'Il y a 4 jours',
      },
      {
        id: 'rev-3',
        author: 'M. Roland D.',
        city: 'Calavi (Vedoko)',
        rating: 5,
        comment: `Livraison rapide et paiement à la réception sans problème. Je recommande les yeux fermés.`,
        date: 'Il y a 1 semaine',
      },
    ],
  };
}
