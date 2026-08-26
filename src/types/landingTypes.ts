export interface LandingOffer {
  id: string;
  name: string;          // ex: "1 Article (Découverte)" vs "Pack Duo (Populaire)"
  quantity: number;
  priceFCFA: number;
  originalPriceFCFA: number;
  badge?: string;        // ex: "Le Plus Populaire"
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
  sellingPriceFCFA: number;
  originalPriceFCFA: number;
  guaranteeDays: number;
  offers: LandingOffer[];
  keyBenefits: string[];
  reviews: CustomerReview[];
}
