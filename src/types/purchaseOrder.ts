export type POStatus =
  | 'negotiating'     // En négociation
  | 'paid'            // Payé au fournisseur
  | 'warehouse_china' // Reçu entrepôt Chine (Transitaire)
  | 'in_transit'      // En mer / En vol (🚢 / ✈️)
  | 'customs_cleared' // Dédouané / Arrivé
  | 'stocked';        // En stock magasin

export type FreightMode = 'bateau' | 'avion';

export type CurrencyCode = 'RMB' | 'USD' | 'FCFA';

export interface POVariantItem {
  id: string;
  name: string;      // ex: "Noir", "Taille L"
  quantity: number;
  unitPrice: number; // en devise sélectionnée
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string; // ex: PO-2026-001
  createdAt: string;
  updatedAt: string;
  
  // Product info
  productId?: string;
  productName: string;
  productImg?: string;

  // Supplier info
  supplierName: string;
  supplierContact?: string; // WhatsApp / WeChat / Téléphone
  supplierLink?: string;    // Lien 1688 / Alibaba

  // Currency & Prices
  currency: CurrencyCode;
  exchangeRateToFCFA: number; // Taux de change (ex: 88 pour RMB, 615 pour USD)
  unitPriceOriginal: number;  // Prix unitaire usine
  quantity: number;           // Total pièces
  variants: POVariantItem[];

  // Logistics & Freight
  freightMode: FreightMode;
  forwarderName: string;       // Nom du transitaire (ex: Speedaf, DHL, Transitaire Maritime)
  forwarderWarehouse?: string; // Adresse entrepôt Chine
  shippingMark: string;        // Code de marquage carton (ex: BJ-COT-042)
  estimatedWeightKg: number;   // Poids total estimé en kg
  freightRatePerKgFCFA: number;// Tarif fret par kg (ex: 3500 pour bateau, 9000 pour avion)
  trackingNumber?: string;     // Numéro de tracking / suivi
  estimatedArrivalDate?: string; // Date estimée d'arrivée (ETA)

  // Status & Notes
  status: POStatus;
  notes?: string;
}

export interface POSummaryStats {
  totalOrders: number;
  totalUnits: number;
  totalMerchandiseFCFA: number;
  totalFreightFCFA: number;
  inTransitCount: number;
  negotiatingCount: number;
}
