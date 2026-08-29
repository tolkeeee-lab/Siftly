'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductData } from '../types/product';
import {
  TablePresetView,
  QuickFilterKey,
  SortConfig,
  SortFieldKey,
  VisibleColumnGroups,
} from '../types/tableFeatures';
import {
  calculateCOGS,
  calculateMargin,
  calculateMarginPct,
  calculateNoteFinale,
} from '../utils/calculations';

function parseNum(val: string | number | null | undefined): number {
  if (val === '' || val === null || val === undefined) return -Infinity;
  const num = Number(val);
  return isNaN(num) ? -Infinity : num;
}

export function useTableFeatures(products: ProductData[]) {
  const [activeFilter, setActiveFilter] = useState<QuickFilterKey>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [presetView, setPresetView] = useState<TablePresetView>('all');
  const [visibleGroups, setVisibleGroups] = useState<VisibleColumnGroups>({
    identification: true,
    costs: true,
    results: true,
    scoring: true,
    marketing: true,
  });

  const toggleGroup = useCallback((group: keyof VisibleColumnGroups) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }, []);

  const applyPresetView = useCallback((preset: TablePresetView) => {
    setPresetView(preset);
    switch (preset) {
      case 'financial':
        setVisibleGroups({
          identification: true,
          costs: true,
          results: true,
          scoring: false,
          marketing: false,
        });
        break;
      case 'scoring':
        setVisibleGroups({
          identification: true,
          costs: false,
          results: false,
          scoring: true,
          marketing: false,
        });
        break;
      case 'compact':
        setVisibleGroups({
          identification: true,
          costs: false,
          results: true,
          scoring: false,
          marketing: true,
        });
        break;
      case 'all':
      default:
        setVisibleGroups({
          identification: true,
          costs: true,
          results: true,
          scoring: true,
          marketing: true,
        });
        break;
    }
  }, []);

  const toggleSort = useCallback((key: SortFieldKey) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        // By default, for weight ('poids'), sort ascending (lightest first)
        const defaultDir = key === 'poids' || key === 'cogs' || key === 'sourcing' || key === 'cac' ? 'asc' : 'desc';
        return { key, direction: defaultDir };
      }
      if (prev.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  }, []);

  const filterCounts = useMemo(() => {
    let favorites = 0;
    let weight_light = 0;
    let weight_medium = 0;
    let weight_heavy = 0;
    let margin40 = 0;
    let score4 = 0;
    let bateau = 0;
    let avion = 0;

    products.forEach((p) => {
      if (p.isFavorite) favorites++;

      const weight = Number(p.poids) || 0;
      if (weight > 0 && weight <= 0.3) weight_light++;
      else if (weight > 0.3 && weight <= 1.0) weight_medium++;
      else if (weight > 1.0) weight_heavy++;

      const marginPct = calculateMarginPct(p);
      if (marginPct >= 40) margin40++;

      const { noteNum } = calculateNoteFinale(p);
      if (noteNum !== null && noteNum >= 4.0) score4++;

      if (p.modeimport === 'avion') avion++;
      else bateau++;
    });

    return {
      all: products.length,
      favorites,
      weight_light,
      weight_medium,
      weight_heavy,
      margin40,
      score4,
      bateau,
      avion,
      top3: Math.min(3, products.length),
    };
  }, [products]);

  const processedProducts = useMemo(() => {
    let list = [...products];

    // Quick Filters
    if (activeFilter === 'favorites') {
      list = list.filter((p) => p.isFavorite);
    } else if (activeFilter === 'weight_light') {
      list = list.filter((p) => {
        const w = Number(p.poids) || 0;
        return w > 0 && w <= 0.3;
      });
    } else if (activeFilter === 'weight_medium') {
      list = list.filter((p) => {
        const w = Number(p.poids) || 0;
        return w > 0.3 && w <= 1.0;
      });
    } else if (activeFilter === 'weight_heavy') {
      list = list.filter((p) => (Number(p.poids) || 0) > 1.0);
    } else if (activeFilter === 'margin40') {
      list = list.filter((p) => calculateMarginPct(p) >= 40);
    } else if (activeFilter === 'score4') {
      list = list.filter((p) => {
        const { noteNum } = calculateNoteFinale(p);
        return noteNum !== null && noteNum >= 4.0;
      });
    } else if (activeFilter === 'bateau') {
      list = list.filter((p) => (p.modeimport || 'bateau') === 'bateau');
    } else if (activeFilter === 'avion') {
      list = list.filter((p) => p.modeimport === 'avion');
    } else if (activeFilter === 'top3') {
      list = list.slice(0, 3);
    }

    // Sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const mult = direction === 'asc' ? 1 : -1;

      list.sort((a, b) => {
        if (key === 'produit') {
          return mult * (a.produit || '').localeCompare(b.produit || '', 'fr');
        }
        if (key === 'poids') {
          const pa = Number(a.poids) || 0;
          const pb = Number(b.poids) || 0;
          return mult * (pa - pb);
        }
        if (key === 'marge') {
          return mult * (calculateMargin(a) - calculateMargin(b));
        }
        if (key === 'margepct') {
          return mult * (calculateMarginPct(a) - calculateMarginPct(b));
        }
        if (key === 'cogs') {
          return mult * (calculateCOGS(a) - calculateCOGS(b));
        }
        if (key === 'note') {
          const na = calculateNoteFinale(a).noteNum ?? -1;
          const nb = calculateNoteFinale(b).noteNum ?? -1;
          return mult * (na - nb);
        }
        const valA = a[key as keyof ProductData];
        const valB = b[key as keyof ProductData];
        const va = typeof valA === 'object' ? 0 : parseNum(valA as string | number | undefined);
        const vb = typeof valB === 'object' ? 0 : parseNum(valB as string | number | undefined);
        return mult * (va - vb);
      });
    }

    return list;
  }, [products, activeFilter, sortConfig]);

  return {
    activeFilter,
    setActiveFilter,
    sortConfig,
    toggleSort,
    presetView,
    applyPresetView,
    visibleGroups,
    toggleGroup,
    filterCounts,
    processedProducts,
  };
}
