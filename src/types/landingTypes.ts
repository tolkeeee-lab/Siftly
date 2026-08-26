export type LandingSectionId =
  | 'headline'     // Titre & Note clients
  | 'video'        // Vidéo démonstration
  | 'hero_image'   // Photo principale & Badge Promo
  | 'gallery'      // Galerie photos secondaires
  | 'cta_button'   // Bouton Commander & Badges Confiance
  | 'benefits'     // Avantages & Arguments clés
  | 'reviews'      // Avis clients
  | 'order_form';  // Formulaire de commande COD

export interface LandingOffer {
  id: string;
  name: string;          // ex: "1 Article (Découverte)" vs "Pack Duo (Populaire)"
  quantity: number;
  priceFCFA: number;
  originalPriceFCFA: number;
  badge?: string;        // ex: "🔥 OFFRE RECOMMANDÉE (-20%)"
  isRecommended?: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;        // 1 to 5
  comment: string;
  date: string;
}

export interface LandingPageConfig {
  productId: string;
  title: string;
  hookHeadline: string;
  subHeadline: string;
  heroImage: string;
  galleryImages?: string[]; // Photos additionnelles du produit
  videoUrl?: string;     // Lien vidéo YouTube ou MP4
  sellingPriceFCFA: number;
  originalPriceFCFA: number;
  guaranteeDays: number;
  whatsappSupportNumber?: string; // ex: "+229 97 00 00 00"
  urgencyText?: string;
  showCountdown?: boolean;
  showStockAlert?: boolean;
  offers: LandingOffer[];
  keyBenefits: string[];
  reviews: CustomerReview[];
  sectionOrder?: LandingSectionId[]; // Ordre d'affichage personnalisable des blocs
}
