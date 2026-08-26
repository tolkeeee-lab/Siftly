export type MovementType =
  | 'po_inflow'     // Réception arrivage transitaire (PO Chine)
  | 'cod_outflow'   // Sortie pour commande client livrée (COD)
  | 'adjustment'    // Ajustement manuel (Casse, inventaire physique)
  | 'return_in';    // Retour client remis en rayon

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  date: string;
  type: MovementType;
  quantityChange: number; // +50 ou -2
  reason: string;
  referenceDoc?: string;  // ex: PO-2026-001 ou COD-2026-003
}

export interface StockItem {
  productId: string;
  productName: string;
  productImg?: string;
  unitCOGSFCFA: number;
  sellingPriceFCFA: number;
  currentStock: number;
  reservedStock: number;      // Colis en cours de livraison
  minThreshold: number;       // Seuil d'alerte rupture (ex: 10 pcs)
  avgDailySales: number;      // Ventes moyennes / jour
  daysOfStockLeft: number;    // Jours de stock restants
  isCriticalLow: boolean;     // Alerte rouge rupture
}

export interface StockSummaryStats {
  totalSkus: number;
  totalPhysicalUnits: number;
  totalStockValueFCFA: number;
  potentialRevenueFCFA: number;
  criticalLowCount: number;
}
