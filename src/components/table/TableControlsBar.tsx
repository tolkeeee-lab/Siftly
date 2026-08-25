'use client';

import React, { useState } from 'react';
import { Filter, Eye, Sparkles, TrendingUp, Ship, Plane, Trophy, LayoutGrid, Check } from 'lucide-react';
import { QuickFilterKey, TablePresetView, VisibleColumnGroups } from '../../types/tableFeatures';

interface TableControlsBarProps {
  activeFilter: QuickFilterKey;
  onSelectFilter: (filter: QuickFilterKey) => void;
  filterCounts: {
    all: number;
    margin40: number;
    score4: number;
    bateau: number;
    avion: number;
    top3: number;
  };
  presetView: TablePresetView;
  onSelectPresetView: (view: TablePresetView) => void;
  visibleGroups: VisibleColumnGroups;
  onToggleGroup: (group: keyof VisibleColumnGroups) => void;
}

export const TableControlsBar: React.FC<TableControlsBarProps> = ({
  activeFilter,
  onSelectFilter,
  filterCounts,
  presetView,
  onSelectPresetView,
  visibleGroups,
  onToggleGroup,
}) => {
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);

  const filters: Array<{ key: QuickFilterKey; label: string; icon: React.ReactNode; count: number }> = [
    { key: 'all', label: 'Tous', icon: <LayoutGrid className="w-3.5 h-3.5" />, count: filterCounts.all },
    { key: 'margin40', label: 'Marge ≥ 40%', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />, count: filterCounts.margin40 },
    { key: 'score4', label: 'Note ≥ 4.0/5', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, count: filterCounts.score4 },
    { key: 'bateau', label: 'Bateau', icon: <Ship className="w-3.5 h-3.5 text-sky-400" />, count: filterCounts.bateau },
    { key: 'avion', label: 'Avion', icon: <Plane className="w-3.5 h-3.5 text-indigo-400" />, count: filterCounts.avion },
    { key: 'top3', label: 'Top 3', icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />, count: filterCounts.top3 },
  ];

  const views: Array<{ key: TablePresetView; label: string }> = [
    { key: 'all', label: 'Vue Complète' },
    { key: 'financial', label: 'Vue Rentabilité' },
    { key: 'scoring', label: 'Vue Scoring' },
    { key: 'compact', label: 'Vue Synthétique' },
  ];

  const groupLabels: Array<{ key: keyof VisibleColumnGroups; label: string }> = [
    { key: 'identification', label: 'Liens & Médias' },
    { key: 'costs', label: 'Coûts de revient' },
    { key: 'results', label: 'Marges & Vente' },
    { key: 'scoring', label: '9 Critères de score' },
    { key: 'marketing', label: 'Cible & Angle' },
  ];

  return (
    <div className="table-controls-wrap">
      {/* Quick Filter Badges */}
      <div className="filter-badges-strip">
        <span className="filter-badge-title">
          <Filter className="w-3 h-3" /> Filtres :
        </span>
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              className={`filter-badge ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(f.key)}
            >
              {f.icon}
              <span>{f.label}</span>
              <span className="filter-count">{f.count}</span>
            </button>
          );
        })}
      </div>

      {/* View Presets & Column Customizer */}
      <div className="views-control-strip">
        <div className="preset-views-pills">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`preset-view-btn ${presetView === v.key ? 'active' : ''}`}
              onClick={() => onSelectPresetView(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Column Group Toggle Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="columns-toggle-btn"
            onClick={() => setIsColumnsMenuOpen((prev) => !prev)}
            title="Afficher ou masquer des colonnes"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Colonnes</span>
          </button>

          {isColumnsMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsColumnsMenuOpen(false)}
              />
              <div className="columns-menu-dropdown z-50">
                <div className="columns-menu-header">Colonnes affichées</div>
                {groupLabels.map((g) => {
                  const isVisible = visibleGroups[g.key];
                  return (
                    <button
                      key={g.key}
                      type="button"
                      className="columns-menu-item"
                      onClick={() => onToggleGroup(g.key)}
                    >
                      <div className={`checkbox-box ${isVisible ? 'checked' : ''}`}>
                        {isVisible && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
