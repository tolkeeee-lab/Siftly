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
  grossRevenueFCFA: number;          // CA total encaissé (COD)
  totalDeliveredUnits: number;       // Unités livrées

  // Direct Costs
  cogsFCFA: number;                  // Coût marchandise (sourcing + fret)
  grossProfitFCFA: number;           // Marge brute
  grossMarginPct: number;            // Marge brute %

  // Operating Expenses (OPEX)
  totalAdSpendFCFA: number;          // Pub Facebook + TikTok
  totalDeliveryFeesFCFA: number;     // Frais livreurs
  totalReturnLossesFCFA: number;     // Pertes sur retours
  totalGeneralExpensesFCFA: number;  // Emballages, forfaits, etc.
  totalOperatingExpensesFCFA: number;// Total charges

  // Net Results
  netProfitFCFA: number;             // BÉNÉFICE NET RÉEL
  netMarginPct: number;              // Marge nette %
}

export interface CashflowBreakdownItem {
  label: string;
  amountFCFA: number;
  pctOfRevenue: number;
  color: string;
  icon: string;
}
