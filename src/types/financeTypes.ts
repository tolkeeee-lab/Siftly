export type ExpenseCategory =
  | 'ads_facebook'     // Pub Facebook / Instagram Ads
  | 'ads_tiktok'       // Pub TikTok Ads
  | 'packaging'        // Cartons, scotch, sachets
  | 'phone_internet'   // Forfait internet, recharge appels clients
  | 'salary'           // Salaire assistant / closer
  | 'rent_warehouse'   // Loyer local / stockage
  | 'other';           // Divers

export interface ExpenseItem {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amountFCFA: number;
}

export interface PnLStatement {
  // Revenue
  grossRevenueFCFA: number;          // CA total encaissé (COD Livré)
  totalDeliveredUnits: number;       // Unités livrées
  totalDeliveredOrders: number;      // Commandes livrées
  totalPendingOrders: number;        // Commandes en cours / à confirmer
  pipelineRevenueFCFA: number;       // CA potentiel en cours de livraison

  // Direct Costs
  cogsFCFA: number;                  // Coût marchandise (sourcing + fret)
  grossProfitFCFA: number;           // Marge brute
  grossMarginPct: number;            // Marge brute %

  // Operating Expenses (OPEX)
  totalAdSpendFCFA: number;          // Pub Facebook + TikTok
  totalDeliveryFeesFCFA: number;     // Frais livreurs payés sur livraisons
  totalReturnLossesFCFA: number;     // Pertes sur retours
  totalGeneralExpensesFCFA: number;  // Emballages, forfaits, etc.
  totalOperatingExpensesFCFA: number;// Total charges

  // Net Results
  netProfitFCFA: number;             // BÉNÉFICE NET RÉEL EN POCHE
  netMarginPct: number;              // Marge nette %
}

export interface ProductRevenueItem {
  productId: string;
  productName: string;
  productImg?: string;
  totalOrdersCount: number;         // Total commandes reçues
  deliveredOrdersCount: number;     // Total commandes LIVRÉES et encaissées
  cancelledOrdersCount: number;     // Total retours / refusés
  deliveryRatePct: number;          // Taux de livraison réel (%)
  deliveredRevenueFCFA: number;     // CA Réel Encaissé (FCFA)
  deliveredUnitsCount: number;      // Pièces livrées
  cogsFCFA: number;                 // Coût d'achat marchandises livrées
  deliveryFeesFCFA: number;         // Frais livreurs
  returnLossesFCFA: number;         // Pertes sur retours (500F/retour)
  netProfitFCFA: number;            // Bénéfice Net généré par ce produit
  pctOfGlobalRevenue: number;       // Contribution au CA global (%)
}

export interface CashflowBreakdownItem {
  label: string;
  amountFCFA: number;
  pctOfRevenue: number;
  color: string;
  icon: string;
}
