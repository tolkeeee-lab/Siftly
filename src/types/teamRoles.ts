export type UserRole =
  | 'admin'        // 👑 Propriétaire / Fondateur (Accès Total)
  | 'assistant'    // 🤝 Assistant de Direction / Bras Droit (Accès Total)
  | 'media_buyer'  // 🎬 Media Buyer (Recherche, Ads, Landing - Finances masquées)
  | 'logistics'    // 🚚 Responsable Logistique / Service Client (Suivi COD & Livreurs)
  | 'inventory';   // 📦 Magasinier (Stock & Sourcing)

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addedDate: string;
  isActive: boolean;
}

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
    label: '👑 Propriétaire (Fondateur)',
    badge: 'Accès 100% Total',
    canViewFinances: true,
    canViewSupplierCosts: true,
    canEditOrders: true,
    canEditStock: true,
  },
  assistant: {
    role: 'assistant',
    label: '🤝 Assistant de Direction (Bras Droit)',
    badge: 'Accès 100% Total',
    canViewFinances: true,
    canViewSupplierCosts: true,
    canEditOrders: true,
    canEditStock: true,
  },
  media_buyer: {
    role: 'media_buyer',
    label: '🎬 Media Buyer',
    badge: 'Ads & Pages de Vente',
    canViewFinances: false,
    canViewSupplierCosts: false,
    canEditOrders: false,
    canEditStock: false,
  },
  logistics: {
    role: 'logistics',
    label: '🚚 Responsable Logistique',
    badge: 'Suivi COD & Livreurs',
    canViewFinances: false,
    canViewSupplierCosts: false,
    canEditOrders: true,
    canEditStock: false,
  },
  inventory: {
    role: 'inventory',
    label: '📦 Magasinier & Stock',
    badge: 'Stock & Arrivages',
    canViewFinances: false,
    canViewSupplierCosts: true,
    canEditOrders: false,
    canEditStock: true,
  },
};
