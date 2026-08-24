import { RankCriterionOption, ScoreFieldKey } from '../types/product';

export const SCORE_CRITERIA_LIST: RankCriterionOption[] = [
  { key: 'douleur', label: 'Douleur problème' },
  { key: 'nonres', label: 'Coût non-résolution' },
  { key: 'etendue', label: 'Étendue marché cible' },
  { key: 'impact', label: 'Impact avant/après' },
  { key: 'waouh', label: 'Effet waouh' },
  { key: 'innovant', label: 'Caractère innovant' },
  { key: 'nonsaison', label: 'Non-saisonnalité' },
  { key: 'habitudes', label: 'Habitudes conso.' },
  { key: 'poidsfacteur', label: 'Facteur poids' },
  { key: 'marge_extra', label: 'Marge brute (F CFA)', isExtra: true },
];

export const DEFAULT_CHECKED_CRITERIA: Array<ScoreFieldKey | 'marge_extra'> = [
  'douleur',
  'impact',
  'nonsaison',
  'habitudes',
];

export const RANK_PRESETS: Record<string, Array<ScoreFieldKey | 'marge_extra'>> = {
  note: ['douleur', 'nonres', 'etendue', 'impact', 'waouh', 'innovant', 'nonsaison', 'habitudes', 'poidsfacteur'],
  faisabilite: ['douleur', 'nonres', 'impact', 'habitudes', 'nonsaison'],
  marge: ['marge_extra'],
};
