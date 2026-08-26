'use client';

import React from 'react';
import { Filter, User } from 'lucide-react';
import { CODStatus, Livreur } from '../../types/codLogistics';

export type CODFilterStatusKey = 'all' | CODStatus;

interface CODFilterBarProps {
  activeStatus: CODFilterStatusKey;
  onSelectStatus: (status: CODFilterStatusKey) => void;
  statusCounts: Record<CODFilterStatusKey, number>;
  livreurs: Livreur[];
  selectedLivreurId: string;
  onSelectLivreur: (id: string) => void;
}

export const CODFilterBar: React.FC<CODFilterBarProps> = ({
  activeStatus,
  onSelectStatus,
  statusCounts,
  livreurs,
  selectedLivreurId,
  onSelectLivreur,
}) => {
  const statuses: Array<{ key: CODFilterStatusKey; label: string; icon: string }> = [
    { key: 'all', label: 'Toutes', icon: '📋' },
    { key: 'to_confirm', label: 'À Confirmer', icon: '📞' },
    { key: 'ready_to_ship', label: 'Prêt à expédier', icon: '📦' },
    { key: 'out_for_delivery', label: 'En Livraison', icon: '🛵' },
    { key: 'delivered', label: 'Livré & Encaissé', icon: '💵' },
    { key: 'postponed', label: 'Reporté', icon: '🔄' },
    { key: 'cancelled', label: 'Annulé / Refusé', icon: '❌' },
  ];

  return (
    <div className="cod-filter-wrap">
      {/* Status Filter Badges */}
      <div className="cod-filter-strip">
        <span className="cod-filter-title">
          <Filter className="w-3 h-3" /> Statut :
        </span>
        {statuses.map((s) => {
          const isActive = activeStatus === s.key;
          const count = statusCounts[s.key] || 0;
          return (
            <button
              key={s.key}
              type="button"
              className={`cod-filter-badge ${isActive ? 'active' : ''}`}
              onClick={() => onSelectStatus(s.key)}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Livreur Filter Dropdown */}
      <div className="cod-livreur-filter-box">
        <User className="w-3.5 h-3.5 text-gold-deep" />
        <span style={{ fontSize: '11.5px', fontFamily: 'IBM Plex Mono' }}>Filtrer par Livreur :</span>
        <select
          className="cod-livreur-select"
          value={selectedLivreurId}
          onChange={(e) => onSelectLivreur(e.target.value)}
        >
          <option value="">Tous les livreurs</option>
          {livreurs.map((liv) => (
            <option key={liv.id} value={liv.id}>
              {liv.name} ({liv.zone})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
