'use client';

import React from 'react';
import { ProductData, ScoreFieldKey } from '../../../types/product';
import { calculateNoteFinale } from '../../../utils/calculations';
import { getScoreColorStyle } from '../../../utils/formatters';

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
  const { noteText, noteNum } = calculateNoteFinale(product);
  const noteStyle = noteNum !== null ? getScoreColorStyle(noteNum) : undefined;

  return (
    <>
      {SCORE_FIELDS.map((key, idx) => {
        const isLastScore = idx === SCORE_FIELDS.length - 1;
        const val = product[key];
        const style = getScoreColorStyle(val);

        return (
          <td key={key} className={`num-col ${isLastScore ? 'group-end' : ''}`}>
            <input
              className="cell-in score"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={val ?? ''}
              style={{
                ...style,
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </td>
        );
      })}
      <td
        className="num-col group-end computed note-finale"
        style={noteStyle}
      >
        {noteText}
      </td>
    </>
  );
};
