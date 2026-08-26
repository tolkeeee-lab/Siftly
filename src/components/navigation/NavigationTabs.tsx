'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Package,
  Scale,
  Video,
  Gift,
  Store,
  Truck,
  Boxes,
  TrendingUp,
  ChevronRight,
  Compass,
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
  const router = useRouter();
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  const stripRef = useRef<HTMLElement | null>(null);

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
      href: '/compare',
      label: 'Comparateur A/B',
      icon: <Scale className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'ads',
      href: '/ads',
      label: 'Ads Studio & Scripts',
      icon: <Video className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'offers',
      href: '/offers',
      label: 'Offres & Packs Irrésistibles',
      icon: <Gift className="w-3.5 h-3.5" />,
      isAvailable: true,
      badge: 'Nouveau',
    },
    {
      id: 'landing',
      href: '/landing',
      label: 'Pages de Vente (Landing COD)',
      icon: <Store className="w-3.5 h-3.5" />,
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
      id: 'stock',
      href: '/stock',
      label: 'Stock Magasin & Alertes',
      icon: <Boxes className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
    {
      id: 'finances',
      href: '/finances',
      label: 'Journal Bénéfice Net (P&L)',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      isAvailable: true,
    },
  ];

  // Scroll active tab into view inside the tab strip ONLY (never scroll window)
  useEffect(() => {
    if (stripRef.current && activeTabRef.current) {
      const strip = stripRef.current;
      const tab = activeTabRef.current;
      const targetScroll = tab.offsetLeft - (strip.clientWidth / 2) + (tab.clientWidth / 2);
      strip.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [pathname]);

  const handleMobileSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetHref = e.target.value;
    if (targetHref && targetHref !== pathname) {
      router.push(targetHref);
    }
  };

  return (
    <div className="nav-tabs-wrapper">
      {/* Mobile Quick Switcher Dropdown (visible on small screens) */}
      <div className="nav-mobile-dropdown-bar">
        <Compass className="w-3.5 h-3.5 text-gold-deep flex-shrink-0" />
        <span className="nav-mobile-lbl">Naviguer vers :</span>
        <select
          className="nav-mobile-select"
          value={pathname}
          onChange={handleMobileSelectChange}
        >
          {tabs.map((t) => (
            <option key={t.id} value={t.href}>
              {t.label} {pathname === t.href ? '✓ (Page Actuelle)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Full Horizontal Navigation Strip */}
      <nav className="nav-tabs-strip" ref={stripRef} aria-label="Modules principaux">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              prefetch={true}
              ref={isActive ? activeTabRef : null}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && <span className="nav-tab-badge">{tab.badge}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
