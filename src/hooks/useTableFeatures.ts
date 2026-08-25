'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductData } from '../types/product';
import {
  QuickFilterKey,
  SortConfig,
  SortFieldKey,
  TablePresetView,
  VisibleColumnGroups,
} from '../types/tableFeatures';
import {
  calculateMargin,
  calculateMarginPct,
  calculateNoteFinale,
  calculateCOGS,
} from '../utils/calculations';
import { parseNum } from '../utils/formatters';

const DEFAULT_VISIBLE_GROUPS: VisibleColumnGroups = {
  identification: true,
  costs: true,
  results: true,
  scoring: true,
  marketing: true,
};

export function useTableFeatures(products: ProductData[]) {
  const [activeFilter, setActiveFilter] = useState<QuickFilterKey>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [presetView, setPresetView] = useState<TablePresetView>('all');
  const [visibleGroups, setVisibleGroups] = useState<VisibleColumnGroups>(DEFAULT_VISIBLE_GROUPS);

  const applyPresetView = useCallback((view: TablePresetView) => {
    setPresetView(view);
    if (view === 'all') {
      setVisibleGroups({ identification: true, costs: true, results: true, scoring: true, marketing: true });
    } else if (view === 'financial') {
      setVisibleGroups({ identification: false, costs: true, results: true, scoring: false, marketing: false });
    } else if (view === 'scoring') {
      setVisibleGroups({ identification: false, costs: false, results: true, scoring: true, marketing: false });
    } else if (view === 'compact') {
      setVisibleGroups({ identification: false, costs: false, results: true, scoring: false, marketing: false });
    }
  }, []);

  const toggleGroup = useCallback((group: keyof VisibleColumnGroups) => {
    setVisibleGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    setPresetView('all');
  }, []);

  const toggleSort = useCallback((key: SortFieldKey) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  }, []);

  const filterCounts = useMemo(() => {
    let margin40 = 0;
    let score4 = 0;
    let bateau = 0;
    let avion = 0;

    products.forEach((p) => {
      const marginPct = calculateMarginPct(p);
      if (marginPct >= 40) margin40++;

      const { noteNum } = calculateNoteFinale(p);
      if (noteNum !== null && noteNum >= 4.0) score4++;

      if (p.modeimport === 'avion') avion++;
      else bateau++;
    });

    return {
      all: products.length,
      margin40,
      score4,
      bateau,
      avion,
      top3: Math.min(3, products.length),
    };
  }, [products]);

  const processedProducts = useMemo(() => {
    let list = [...products];

    if (activeFilter === 'margin40') {
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

    if (sortConfig) {
      const { key, direction } = sortConfig;
      const mult = direction === 'asc' ? 1 : -1;

      list.sort((a, b) => {
        if (key === 'produit') {
          return mult * (a.produit || '').localeCompare(b.produit || '', 'fr');
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
        const va = parseNum(a[key as keyof ProductData]);
        const vb = parseNum(b[key as keyof ProductData]);
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
