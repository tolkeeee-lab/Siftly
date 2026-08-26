export function formatFCFA(n: number): string {
  if (isNaN(n)) return '0 FCFA';
  return Math.round(n).toLocaleString('fr-FR') + ' FCFA';
}

export function formatPercent(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '—';
  return val.toFixed(1) + ' %';
}

export function parseNum(val: number | string | undefined | null): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? 0 : parsed;
}

export function normalizeKey(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function escapeHtml(str: string | number | null | undefined): string {
  return String(str == null ? '' : str).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c] || c)
  );
}

export function getScoreColorStyle(val: any): { backgroundColor: string; color: string; fontWeight: number } | undefined {
  const n = parseFloat(String(val));
  if (isNaN(n) || String(val).trim() === '') return undefined;
  if (n <= 1.5) return { backgroundColor: '#F9D4C8', color: '#8B2E1A', fontWeight: 600 };
  if (n <= 2.5) return { backgroundColor: '#FDEBD6', color: '#7A4E1E', fontWeight: 600 };
  if (n <= 3.5) return { backgroundColor: '#FFF8E0', color: '#7A6220', fontWeight: 600 };
  if (n <= 4.5) return { backgroundColor: '#DCF0DA', color: '#2D6B2A', fontWeight: 600 };
  return { backgroundColor: '#B8E6B5', color: '#1A5218', fontWeight: 700 };
}

export function getMarginColorStyle(pct: number, hasSalePrice: boolean): { color: string; fontWeight: number } | undefined {
  if (!hasSalePrice) return undefined;
  if (pct < 20) return { color: '#C0392B', fontWeight: 600 };
  if (pct < 40) return { color: '#D35400', fontWeight: 600 };
  return { color: '#27AE60', fontWeight: 600 };
}
