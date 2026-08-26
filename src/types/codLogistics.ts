export type CODStatus =
  | 'to_confirm'      // 📞 À Confirmer (Appel client)
  | 'ready_to_ship'  // 📦 Prêt à expédier (Emballé)
  | 'out_for_delivery'// 🛵 En cours de livraison (Dans le sac du livreur)
  | 'delivered'       // 💵 Livré & Encaissé (Cash collecté)
  | 'postponed'       // 🔄 Reporté (Reprogrammé)
  | 'cancelled';      // ❌ Annulé / Retourné (Refus client)

export interface Livreur {
  id: string;
  name: string;        // ex: "Livreur Boris"
  phone: string;       // ex: "+229 97 00 00 00"
  zone: string;        // ex: "Cotonou & Akpakpa"
  deliveryFee: number; // Frais par livraison réussie (ex: 1500 FCFA)
  returnFee: number;   // Frais si retour/refus (ex: 500 FCFA)
}

export interface CODOrder {
  id: string;
  orderNumber: string; // ex: COD-2026-001
  createdAt: string;
  updatedAt: string;

  // Product info
  productId?: string;
  productName: string;
  quantity: number;
  totalPriceFCFA: number; // Montant total à encaisser

  // Customer info
  customerName: string;
  customerPhone: string;
  customerCity: string;     // ex: "Cotonou"
  customerAddress: string;  // ex: "Haie Vive, en face de la pharmacie"

  // Delivery & Livreur info
  livreurId?: string;
  livreurName?: string;
  deliveryFeeFCFA: number;  // Commission livreur

  // Status & Notes
  status: CODStatus;
  deliveryDate?: string;    // Date prévue de livraison
  notes?: string;
}

export interface CODSummaryStats {
  totalOrders: number;
  deliveredCount: number;
  outForDeliveryCount: number;
  toConfirmCount: number;
  cancelledCount: number;
  deliveryRatePct: number;      // Taux de livraison réel (%)
  totalGrossCashFCFA: number;   // Total cash brut encaissé
  totalDeliveryFeesFCFA: number;// Total payé aux livreurs
  totalNetCashFCFA: number;     // Total net restant
}
