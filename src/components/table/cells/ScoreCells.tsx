import React from 'react';
import { ProductData, ScoreFieldKey } from '../../../types/product';
import { calculateNoteFinale } from '../../../utils/calculations';

interface ScoreCellsProps {
  product: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
}

const SCORE_FIELDS: ScoreFieldKey[] = [
  'douleur',
  'nonres',
  'etendue',
  'impact',
  'waouh',
  'innovant',
  'nonsaison',
  'habitudes',
  'poidsfacteur',
];

export const ScoreCells: React.FC<ScoreCellsProps> = ({ product, onChange }) => {
  const { noteText } = calculateNoteFinale(product);

  return (
    <>
      {SCORE_FIELDS.map((key, idx) => {
        const isLastScore = idx === SCORE_FIELDS.length - 1;
        return (
          <td key={key} className={`num-col ${isLastScore ? 'group-end' : ''}`}>
            <input
              className="cell-in score"
              type="number"
              min="0"
              max="5"
              value={product[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </td>
        );
      })}
      <td className="num-col group-end computed note-finale">{noteText}</td>
    </>
  );
};
