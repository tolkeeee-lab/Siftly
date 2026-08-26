export type UserRole =
  | 'admin'        // 👑 Propriétaire / Admin (Accès 100% total)
  | 'media_buyer'  // 🎬 Media Buyer (Recherche, Ads, Landing - Finances/Fournisseurs masqués)
  | 'logistics'    // 🚚 Livreur / Service Client (Suivi COD, Stock - Marges masquées)
  | 'inventory';   // 📦 Magasinier (Stock & Sourcing)

export interface RolePermission {
  role: UserRole;
  label: string;
  badge: string;
  canViewFinances: boolean;
  canViewSupplierCosts: boolean;
  canEditOrders: boolean;
  canEditStock: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  admin: {
    role: 'admin',
    label: '👑 Propriétaire / Admin',
    badge: 'Accès Total',
    canViewFinances: true,
    canViewSupplierCosts: true,
    canEditOrders: true,
    canEditStock: true,
  },
  media_buyer: {
    role: 'media_buyer',
    label: '🎬 Media Buyer',
    badge: 'Ads & Créatives',
    canViewFinances: false,
    canViewSupplierCosts: false,
    canEditOrders: false,
    canEditStock: false,
  },
  logistics: {
    role: 'logistics',
    label: '🚚 Logistique & Service Client',
    badge: 'Livraisons COD',
    canViewFinances: false,
    canViewSupplierCosts: false,
    canEditOrders: true,
    canEditStock: false,
  },
  inventory: {
    role: 'inventory',
    label: '📦 Magasinier & Stock',
    badge: 'Gestion Stocks',
    canViewFinances: false,
    canViewSupplierCosts: true,
    canEditOrders: false,
    canEditStock: true,
  },
};
