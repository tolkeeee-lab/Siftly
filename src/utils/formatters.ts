export function formatFCFA(n: number): string {
  if (isNaN(n)) return '0 F';
  return Math.round(n).toLocaleString('fr-FR') + ' F';
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
