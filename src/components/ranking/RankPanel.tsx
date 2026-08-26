'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Check,
  TrendingUp,
  Sparkles,
  Ship,
  Plane,
  Trophy,
  Feather,
  Package,
  Dumbbell,
} from 'lucide-react';
import { ScoreFieldKey } from '../../types/product';
import { SCORE_CRITERIA_LIST } from '../../constants/presets';
import { QuickFilterKey, TablePresetView, VisibleColumnGroups } from '../../types/tableFeatures';

interface RankPanelProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedCriteria: Array<ScoreFieldKey | 'marge_extra'>;
  onToggleCriterion: (key: ScoreFieldKey | 'marge_extra') => void;
  onApplyPreset: (presetKey: string) => void;
  onApplyRanking: () => void;
  onResetRanking: () => void;

  // Integrated Layout & Filter Controls
  layoutMode: 'table' | 'grid';
  onSelectLayoutMode: (mode: 'table' | 'grid') => void;
  activeFilter: QuickFilterKey;
  onSelectFilter: (filter: QuickFilterKey) => void;
  filterCounts: Record<QuickFilterKey, number>;
  presetView: TablePresetView;
  onSelectPresetView: (view: TablePresetView) => void;
  visibleGroups: VisibleColumnGroups;
  onToggleGroup: (group: keyof VisibleColumnGroups) => void;
}

export const RankPanel: React.FC<RankPanelProps> = ({
  isOpen,
  onToggleOpen,
  selectedCriteria,
  onToggleCriterion,
  onApplyPreset,
  onApplyRanking,
  onResetRanking,
  layoutMode,
  onSelectLayoutMode,
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
    { key: 'all', label: 'Tous', icon: null, count: filterCounts.all },
    { key: 'weight_light', label: '🪶 Plume (<300g)', icon: <Feather className="w-3 h-3 text-emerald-400" />, count: filterCounts.weight_light },
    { key: 'weight_medium', label: '📦 Standard (300g-1kg)', icon: <Package className="w-3 h-3 text-amber-400" />, count: filterCounts.weight_medium },
    { key: 'weight_heavy', label: '🏋️ Lourd (>1kg)', icon: <Dumbbell className="w-3 h-3 text-rose-400" />, count: filterCounts.weight_heavy },
    { key: 'margin40', label: 'Marge ≥ 40%', icon: <TrendingUp className="w-3 h-3 text-emerald-400" />, count: filterCounts.margin40 },
    { key: 'score4', label: 'Note ≥ 4.0', icon: <Sparkles className="w-3 h-3 text-amber-400" />, count: filterCounts.score4 },
    { key: 'bateau', label: 'Bateau', icon: <Ship className="w-3 h-3 text-sky-400" />, count: filterCounts.bateau },
    { key: 'avion', label: 'Avion', icon: <Plane className="w-3 h-3 text-indigo-400" />, count: filterCounts.avion },
    { key: 'top3', label: 'Top 3', icon: <Trophy className="w-3 h-3 text-yellow-400" />, count: filterCounts.top3 },
  ];

  const views: Array<{ key: TablePresetView; label: string }> = [
    { key: 'all', label: 'Vue Complète' },
    { key: 'financial', label: 'Vue Rentabilité' },
    { key: 'scoring', label: 'Vue Scoring' },
    { key: 'compact', label: 'Synthétique' },
  ];

  const groupLabels: Array<{ key: keyof VisibleColumnGroups; label: string }> = [
    { key: 'identification', label: 'Liens & Médias' },
    { key: 'costs', label: 'Coûts de revient' },
    { key: 'results', label: 'Marges & Vente' },
    { key: 'scoring', label: '9 Critères' },
    { key: 'marketing', label: 'Marketing' },
  ];

  return (
    <div className="unified-rank-bar">
      {/* Top Single Row Toolbar */}
      <div className="rank-bar-row">
        {/* Left: Ranking Button + Quick Filters */}
        <div className="rank-bar-left">
          <button className={`tbtn rank-toggle ${isOpen ? 'active' : ''}`} type="button" onClick={onToggleOpen}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Classement intelligent</span>
          </button>

          {/* Quick Filter Badges on the Same Line */}
          <div className="inline-filters">
            {filters.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  className={`inline-filter-badge ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectFilter(f.key)}
                >
                  {f.icon}
                  <span>{f.label}</span>
                  <span className="filter-count">{f.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Layout Mode Switcher (Table vs Cards) + Views */}
        <div className="rank-bar-right">
          {/* Table / Grid Mode Toggle */}
          <div className="layout-mode-pills">
            <button
              type="button"
              className={`layout-mode-btn ${layoutMode === 'table' ? 'active' : ''}`}
              onClick={() => onSelectLayoutMode('table')}
              title="Vue Tableau"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tableau</span>
            </button>
            <button
              type="button"
              className={`layout-mode-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => onSelectLayoutMode('grid')}
              title="Vue Fiches / Cadres"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Fiches</span>
            </button>
          </div>

          {/* Preset Views & Columns (in Table mode only) */}
          {layoutMode === 'table' && (
            <>
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

              {/* Columns Customizer */}
              <div className="relative">
                <button
                  type="button"
                  className="columns-toggle-btn"
                  onClick={() => setIsColumnsMenuOpen((prev) => !prev)}
                  title="Afficher ou masquer des colonnes"
                >
                  <Eye className="w-3 h-3" />
                  <span>Colonnes</span>
                </button>

                {isColumnsMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsColumnsMenuOpen(false)} />
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
            </>
          )}
        </div>
      </div>

      {/* Expandable Criteria Drawer */}
      <div className={`rank-panel ${isOpen ? 'open' : ''}`}>
        <div className="rank-presets">
          <span className="rank-label">Préréglages :</span>
          <button type="button" className="rank-preset" onClick={() => onApplyPreset('note')}>
            Note finale (9 critères)
          </button>
          <button type="button" className="rank-preset" onClick={() => onApplyPreset('faisabilite')}>
            Faisabilité
          </button>
          <button type="button" className="rank-preset" onClick={() => onApplyPreset('marge')}>
            Rentabilité (marge)
          </button>
        </div>

        <div className="rank-criteria">
          {SCORE_CRITERIA_LIST.map((item) => (
            <label key={item.key} className={item.isExtra ? 'rank-extra' : ''}>
              <input
                type="checkbox"
                value={item.key}
                checked={selectedCriteria.includes(item.key)}
                onChange={() => onToggleCriterion(item.key)}
              />
              {item.label}
            </label>
          ))}
        </div>

        <div className="rank-actions">
          <button type="button" className="tbtn save" onClick={onApplyRanking}>
            Classer les produits
          </button>
          <button type="button" className="tbtn load" onClick={onResetRanking}>
            Ordre initial
          </button>
          <span className="rank-hint">
            Trie les lignes selon la moyenne des critères cochés — meilleur produit en premier.
          </span>
        </div>
      </div>
    </div>
  );
};
