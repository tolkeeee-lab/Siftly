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
}
