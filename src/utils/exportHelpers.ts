import { ProductData } from '../types/product';
import {
  calculateFreightCost,
  calculateCOGS,
  calculateMargin,
  calculateMarginPct,
  calculateNoteFinale,
} from './calculations';
import { formatFCFA, escapeHtml } from './formatters';

export function downloadJsonBackup(products: ProductData[]): void {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recherche-produit-siftly-${stamp}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildStaticHtmlReport(products: ProductData[]): string {
  const today = new Date().toLocaleDateString('fr-FR');
  const cols: [keyof ProductData | 'frais' | 'cogs' | 'marge' | 'margepct' | 'note', string][] = [
    ['produit', 'Produit'],
    ['creative', 'Creative'],
    ['alibaba', 'Alibaba'],
    ['siteweb', 'Site web'],
    ['marche', "Marché d'origine"],
    ['concurrent', 'Prix concurrent'],
    ['sourcing', 'Prix sourcing brut'],
    ['poids', 'Poids (kg)'],
    ['modeimport', 'Mode retenu'],
    ['tarifbateau', 'Tarif bateau (F/kg)'],
    ['tarifavion', 'Tarif avion (F/kg)'],
    ['frais', 'Frais import unitaire'],
    ['cac', 'Coût acquisition client (CAC)'],
    ['livraison', 'Livraison offerte (coût)'],
    ['cogs', 'Coût revient (COGS)'],
    ['vente', 'Prix de vente'],
    ['marge', 'Marges brutes'],
    ['margepct', 'Marge %'],
    ['douleur', 'Douleur'],
    ['nonres', 'Non-résolution'],
    ['etendue', 'Étendue'],
    ['impact', 'Impact'],
    ['waouh', 'Waouh'],
    ['innovant', 'Innovant'],
    ['nonsaison', 'Non-saison'],
    ['habitudes', 'Habitudes'],
    ['poidsfacteur', 'Facteur poids'],
    ['note', 'Note finale /5'],
    ['cible', 'Cible'],
    ['angle', "Angle d'attaque"],
  ];

  const bodyRows = products
    .map((r, i) => {
      const frais = calculateFreightCost(r);
      const cogs = calculateCOGS(r);
      const marge = calculateMargin(r);
      const margepct = calculateMarginPct(r);
      const { noteText } = calculateNoteFinale(r);

      const vals: Record<string, any> = {
        ...r,
        modeimport: r.modeimport === 'avion' ? 'Avion' : 'Bateau',
        concurrent: r.concurrent ? formatFCFA(Number(r.concurrent)) : '',
        sourcing: r.sourcing ? formatFCFA(Number(r.sourcing)) : '',
        tarifbateau: r.tarifbateau ? formatFCFA(Number(r.tarifbateau)) : '',
        tarifavion: r.tarifavion ? formatFCFA(Number(r.tarifavion)) : '',
        cac: r.cac ? formatFCFA(Number(r.cac)) : '',
        livraison: r.livraison ? formatFCFA(Number(r.livraison)) : '',
        vente: r.vente ? formatFCFA(Number(r.vente)) : '',
        frais: formatFCFA(frais),
        cogs: formatFCFA(cogs),
        marge: formatFCFA(marge),
        margepct: Number(r.vente) > 0 ? margepct.toFixed(1) + ' %' : '—',
        note: noteText,
      };

      const img = r.imgSrc ? `<img src="${r.imgSrc}" alt="">` : '';
      const cells = cols
        .map(([f]) => {
          if (f === 'produit') {
            return `<td class="img-td"><span class="thumb">${img}</span><span class="pname">${escapeHtml(vals[f])}</span></td>`;
          }
          if (['creative', 'alibaba', 'siteweb'].includes(f) && vals[f]) {
            return `<td class="wide"><a href="${escapeHtml(vals[f])}" target="_blank" rel="noopener">${escapeHtml(vals[f])}</a></td>`;
          }
          if (f === 'note') {
            return `<td class="note-finale">${escapeHtml(vals[f])}</td>`;
          }
          return `<td>${escapeHtml(vals[f])}</td>`;
        })
        .join('');
      return `<tr><td class="rownum">${i + 1}</td>${cells}</tr>`;
    })
    .join('\n');

  const headCells = cols.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join('');

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Recherche produit EAA — Siftly Rapport</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{ --canvas:#141B32; --panel:#F7F2E4; --panel-line:#DCD3B8; --ink:#1E1B14; --ink-soft:#6B6353; --gold:#B8862F; --gold-deep:#7A5A1E; --gold-wash:#EFE0BB; --sage:#4B6B45; --sage-wash:#DCE6D3; --rust-wash:#F0DBCB; --steel-wash:#DAE3E8; }
  *{box-sizing:border-box;}
  body{font-family:'IBM Plex Sans',Arial,sans-serif;background:var(--canvas);color:var(--ink);margin:0;padding:40px 24px;}
  h1{color:var(--panel);font-family:Georgia,serif;margin:0 0 4px;font-weight:500;}
  .meta{color:rgba(247,242,228,0.6);font-size:13px;margin-bottom:24px;font-family:'IBM Plex Mono',monospace;}
  .panel{background:var(--panel);border-radius:6px;padding:10px;overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:12.5px;min-width:2400px;}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--panel-line);white-space:nowrap;}
  th{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft);border-bottom:2px solid var(--ink);position:sticky;top:0;}
  td.wide{white-space:normal;max-width:180px;overflow-wrap:break-word;}
  .rownum{font-family:'IBM Plex Mono',monospace;color:var(--ink-soft);text-align:center;}
  .img-td{display:flex;align-items:center;gap:12px;white-space:normal;min-width:300px;}
  .thumb img{width:60px;height:60px;object-fit:cover;border-radius:6px;flex-shrink:0;}
  .pname{font-weight:500;font-size:14px;}
  .note-finale{text-align:center;color:var(--sage);background:var(--sage-wash) !important;border-radius:6px;font-weight:600;font-family:'IBM Plex Mono',monospace;}
  a{color:var(--gold-deep);}
</style></head>
<body>
  <h1>Siftly — Rapport d'Analyse Produit</h1>
  <div class="meta">Export statique généré le ${today} · ${products.length} produit(s)</div>
  <div class="panel">
    <table>
      <thead><tr><th>#</th>${headCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>
</body></html>`;
}

export function downloadHtmlReport(products: ProductData[]): void {
  const html = buildStaticHtmlReport(products);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rapport-produits-siftly-${stamp}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
