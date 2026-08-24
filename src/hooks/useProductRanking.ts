'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductData, ScoreFieldKey } from '../types/product';
import { DEFAULT_CHECKED_CRITERIA, RANK_PRESETS } from '../constants/presets';
import { calculateMargin, calculateNoteFinale } from '../utils/calculations';

export function useProductRanking(products: ProductData[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<Array<ScoreFieldKey | 'marge_extra'>>(
    DEFAULT_CHECKED_CRITERIA
  );
  const [isRankingActive, setIsRankingActive] = useState(true);

  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);

  const toggleCriterion = useCallback((key: ScoreFieldKey | 'marge_extra') => {
    setSelectedCriteria((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setIsRankingActive(true);
  }, []);

  const applyPreset = useCallback((presetKey: string) => {
    const keys = RANK_PRESETS[presetKey];
    if (keys) {
      setSelectedCriteria(keys);
      setIsRankingActive(true);
    }
  }, []);

  const applyRanking = useCallback(() => {
    setIsRankingActive(true);
  }, []);

  const resetRanking = useCallback(() => {
    setIsRankingActive(false);
  }, []);

  const displayProducts = useMemo(() => {
    if (!isRankingActive || selectedCriteria.length === 0) {
      return [...products].sort((a, b) => a.seq - b.seq);
    }

    let marginValues: number[] | null = null;
    if (selectedCriteria.includes('marge_extra')) {
      marginValues = products.map((p) => calculateMargin(p));
    }

    const minMargin = marginValues && marginValues.length > 0 ? Math.min(...marginValues) : 0;
    const maxMargin = marginValues && marginValues.length > 0 ? Math.max(...marginValues) : 0;

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

      const fallbackNote = calculateNoteFinale(p).noteNum ?? -1;
      const calculatedScore = count > 0 ? sum / count : fallbackNote;

      return {
        product: p,
        score: calculatedScore,
        seq: p.seq,
      };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.seq - b.seq;
    });

    return scored.map((item) => item.product);
  }, [products, selectedCriteria, isRankingActive]);

  return {
    isOpen,
    togglePanel,
    selectedCriteria,
    toggleCriterion,
    applyPreset,
    applyRanking,
    resetRanking,
    isRankingActive,
    displayProducts,
  };
}
