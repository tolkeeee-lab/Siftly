'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { POStatus } from '../../types/purchaseOrder';

export type POFilterKey = 'all' | POStatus;

interface SourcingFilterBarProps {
  activeFilter: POFilterKey;
  onSelectFilter: (filter: POFilterKey) => void;
  filterCounts: Record<POFilterKey, number>;
}

export const SourcingFilterBar: React.FC<SourcingFilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  filterCounts,
}) => {
  const filters: Array<{ key: POFilterKey; label: string; icon: string }> = [
    { key: 'all', label: 'Toutes les commandes', icon: '📋' },
    { key: 'negotiating', label: 'En négociation', icon: '📝' },
    { key: 'paid', label: 'Payé au fournisseur', icon: '💳' },
    { key: 'warehouse_china', label: 'Entrepôt Chine', icon: '🏢' },
    { key: 'in_transit', label: 'En transit (Mer/Vol)', icon: '🚢' },
    { key: 'customs_cleared', label: 'Dédouané', icon: '🛃' },
    { key: 'stocked', label: 'En stock magasin', icon: '📦' },
  ];

  return (
    <div className="sourcing-filter-strip-wrap">
      <div className="sourcing-filter-strip">
        <span className="sourcing-filter-title">
          <Filter className="w-3 h-3" /> Statut :
        </span>
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          const count = filterCounts[f.key] || 0;
          return (
            <button
              key={f.key}
              type="button"
              className={`sourcing-filter-badge ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(f.key)}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
