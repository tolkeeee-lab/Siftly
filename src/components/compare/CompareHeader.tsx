'use client';

import React from 'react';
import { Scale, Trophy, Plus, RefreshCw } from 'lucide-react';

interface CompareHeaderProps {
  comparedCount: number;
  onResetToTop3: () => void;
}

export const CompareHeader: React.FC<CompareHeaderProps> = ({
  comparedCount,
  onResetToTop3,
}) => {
  return (
    <div className="compare-header-wrap">
      <div className="compare-header-top">
        <div>
          <h1 className="compare-title">🥊 Comparateur Face-à-Face & Matrice de Décision</h1>
          <p className="compare-subtitle">
            Comparez 2 à 4 produits gagnants côte-à-côte (marge, scores, fret, seuil de rentabilité) pour choisir le produit #1 à lancer.
          </p>
        </div>

        <button type="button" className="btn-reset-top3" onClick={onResetToTop3}>
          <Trophy className="w-4 h-4 text-gold" />
          <span>Charger le Top 3 Actuel</span>
        </button>
      </div>
    </div>
  );
};
