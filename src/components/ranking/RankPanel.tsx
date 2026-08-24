import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ScoreFieldKey } from '../../types/product';
import { SCORE_CRITERIA_LIST } from '../../constants/presets';

interface RankPanelProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedCriteria: Array<ScoreFieldKey | 'marge_extra'>;
  onToggleCriterion: (key: ScoreFieldKey | 'marge_extra') => void;
  onApplyPreset: (presetKey: string) => void;
  onApplyRanking: () => void;
  onResetRanking: () => void;
}

export const RankPanel: React.FC<RankPanelProps> = ({
  isOpen,
  onToggleOpen,
  selectedCriteria,
  onToggleCriterion,
  onApplyPreset,
  onApplyRanking,
  onResetRanking,
}) => {
  return (
    <div className="rank-bar">
      <button className="tbtn rank-toggle" type="button" onClick={onToggleOpen}>
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Classement intelligent
      </button>

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
