'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductData, ScoreFieldKey } from '../types/product';
import { DEFAULT_CHECKED_CRITERIA, RANK_PRESETS } from '../constants/presets';
import { calculateMargin } from '../utils/calculations';

export function useProductRanking(products: ProductData[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<Array<ScoreFieldKey | 'marge_extra'>>(
    DEFAULT_CHECKED_CRITERIA
  );
  const [sortedProductIds, setSortedProductIds] = useState<string[] | null>(null);

  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);

  const toggleCriterion = useCallback((key: ScoreFieldKey | 'marge_extra') => {
    setSelectedCriteria((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const applyPreset = useCallback((presetKey: string) => {
    const keys = RANK_PRESETS[presetKey];
    if (keys) {
      setSelectedCriteria(keys);
    }
  }, []);

  const applyRanking = useCallback(() => {
    if (selectedCriteria.length === 0) return;

    let marginValues: number[] | null = null;
    if (selectedCriteria.includes('marge_extra')) {
      marginValues = products.map((p) => calculateMargin(p));
    }

    const minMargin = marginValues ? Math.min(...marginValues) : 0;
    const maxMargin = marginValues ? Math.max(...marginValues) : 0;

    const scored = products.map((p, idx) => {
      let sum = 0;
      let count = 0;
      selectedCriteria.forEach((key) => {
        if (key === 'marge_extra') {
          if (marginValues) {
            const v = marginValues[idx];
            const norm = maxMargin > minMargin ? ((v - minMargin) / (maxMargin - minMargin)) * 5 : 2.5;
            sum += norm;
            count++;
          }
        } else {
          const val = p[key];
          if (val !== '' && val !== undefined && val !== null) {
            const num = parseFloat(String(val));
            if (!isNaN(num)) {
              sum += num;
              count++;
            }
          }
        }
      });
      return { id: p.id, score: count > 0 ? sum / count : -Infinity, seq: p.seq };
    });

    scored.sort((a, b) => b.score - a.score || a.seq - b.seq);
    setSortedProductIds(scored.map((s) => s.id));
  }, [products, selectedCriteria]);

  const resetRanking = useCallback(() => {
    setSortedProductIds(null);
  }, []);

  const displayProducts = useMemo(() => {
    if (!sortedProductIds) {
      return [...products].sort((a, b) => a.seq - b.seq);
    }
    const map = new Map(products.map((p) => [p.id, p]));
    const ordered: ProductData[] = [];
    sortedProductIds.forEach((id) => {
      const p = map.get(id);
      if (p) ordered.push(p);
    });
    // Append any newly added products not yet sorted
    products.forEach((p) => {
      if (!ordered.find((o) => o.id === p.id)) {
        ordered.push(p);
      }
    });
    return ordered;
  }, [products, sortedProductIds]);

  return {
    isOpen,
    togglePanel,
    selectedCriteria,
    toggleCriterion,
    applyPreset,
    applyRanking,
    resetRanking,
    displayProducts,
  };
}
