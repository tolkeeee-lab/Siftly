'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Package,
  Scale,
  Video,
  Truck,
  TrendingUp,
} from 'lucide-react';

interface TabItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  isAvailable: boolean;
  badge?: string;
}

export const NavigationTabs: React.FC = () => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      id: 'research',
      href: '/',
      label: 'Recherche & Validation',
      icon: <Search className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'sourcing',
      href: '/sourcing',
      label: 'Sourcing & Bons de Commande (PO)',
      icon: <Package className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'compare',
      href: '#',
      label: 'Comparateur A/B',
      icon: <Scale className="w-3.5 h-3.5" />,
      isAvailable: false,
      badge: 'Bientôt',
    },
    {
      id: 'ads',
      href: '/ads',
      label: 'Ads Studio & Scripts',
      icon: <Video className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'cod',
      href: '/cod',
      label: 'Suivi COD & Livreurs',
      icon: <Truck className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'finances',
      href: '#',
      label: 'Journal Bénéfice Net',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      isAvailable: false,
      badge: 'Bientôt',
    },
  ];

  return (
    <div className="nav-tabs-wrapper">
      <nav className="nav-tabs-strip" aria-label="Modules principaux">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          if (!tab.isAvailable) {
            return (
              <span key={tab.id} className="nav-tab-item disabled" title="Prochainement disponible">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && <span className="nav-tab-badge">{tab.badge}</span>}
              </span>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
