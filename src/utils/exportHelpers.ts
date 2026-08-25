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

export function downloadCsvExport(products: ProductData[]): void {
  const headers = [
    'Rang',
    'Produit',
    'Creative',
    'Lien Alibaba',
    'Site Web',
    'Marché d\'origine',
    'Prix Concurrent (FCFA)',
    'Prix Sourcing (FCFA)',
    'Poids (kg)',
    'Mode Import',
    'Tarif Bateau (F/kg)',
    'Tarif Avion (F/kg)',
    'Frais Import Unitaire (FCFA)',
    'CAC (FCFA)',
    'Livraison Offerte (FCFA)',
    'Coût Revient COGS (FCFA)',
    'Prix de Vente (FCFA)',
    'Marge Brute (FCFA)',
    'Marge %',
    'Douleur problème (/5)',
    'Coût non-résolution (/5)',
    'Étendue marché (/5)',
    'Impact avant/après (/5)',
    'Effet waouh (/5)',
    'Caractère innovant (/5)',
    'Non-saisonnalité (/5)',
    'Habitudes conso (/5)',
    'Facteur poids (/5)',
    'Note Finale (/5)',
    'Cible Marketing',
    'Angle d\'attaque',
  ];

  const escapeCsv = (val: any) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = products.map((p, idx) => {
    const frais = calculateFreightCost(p);
    const cogs = calculateCOGS(p);
    const marge = calculateMargin(p);
    const margePct = calculateMarginPct(p);
    const { noteText } = calculateNoteFinale(p);

    return [
      idx + 1,
      p.produit || '',
      p.creative || '',
      p.alibaba || '',
      p.siteweb || '',
      p.marche || '',
      p.concurrent || 0,
      p.sourcing || 0,
      p.poids || 0,
      p.modeimport || 'bateau',
      p.tarifbateau || 0,
      p.tarifavion || 0,
      frais,
      p.cac || 0,
      p.livraison || 0,
      cogs,
      p.vente || 0,
      marge,
      Number(p.vente) > 0 ? margePct.toFixed(1) + '%' : '0%',
      p.douleur || '',
      p.nonres || '',
      p.etendue || '',
      p.impact || '',
      p.waouh || '',
      p.innovant || '',
      p.nonsaison || '',
      p.habitudes || '',
      p.poidsfacteur || '',
      noteText,
      p.cible || '',
      p.angle || '',
    ].map(escapeCsv).join(';');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `siftly-analyse-produits-${stamp}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadExcelXml(products: ProductData[]): void {
  const stamp = new Date().toISOString().slice(0, 10);
  const headers = [
    '#', 'Produit', 'Creative', 'Alibaba', 'Site Web', 'Marché',
    'Prix Concurrent', 'Sourcing Brut', 'Poids (kg)', 'Mode Import',
    'Tarif Bateau', 'Tarif Avion', 'Frais Import', 'CAC', 'Livraison',
    'COGS (Coût Revient)', 'Prix Vente', 'Marge Brute', 'Marge %',
    'Douleur', 'Non-résolution', 'Étendue', 'Impact', 'Waouh', 'Innovant',
    'Non-saison', 'Habitudes', 'Facteur Poids', 'Note Finale', 'Cible', 'Angle'
  ];

  const rowsXml = products.map((p, idx) => {
    const frais = calculateFreightCost(p);
    const cogs = calculateCOGS(p);
    const marge = calculateMargin(p);
    const margePct = calculateMarginPct(p);
    const { noteText } = calculateNoteFinale(p);

    const cells = [
      `<Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.produit || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.creative || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.alibaba || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.siteweb || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.marche || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.concurrent || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.sourcing || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.poids || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.modeimport === 'avion' ? 'Avion' : 'Bateau'}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.tarifbateau || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.tarifavion || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${frais}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.cac || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.livraison || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${cogs}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${p.vente || 0}</Data></Cell>`,
      `<Cell><Data ss:Type="Number">${marge}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${Number(p.vente) > 0 ? margePct.toFixed(1) + '%' : '—'}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.douleur || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.nonres || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.etendue || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.impact || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.waouh || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.innovant || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.nonsaison || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.habitudes || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${p.poidsfacteur || ''}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${noteText}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.cible || '')}</Data></Cell>`,
      `<Cell><Data ss:Type="String">${escapeHtml(p.angle || '')}</Data></Cell>`,
    ].join('');

    return `<Row>${cells}</Row>`;
  }).join('\n');

  const headerCells = headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeHtml(h)}</Data></Cell>`).join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#141B32" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Produits Siftly">
  <Table>
   <Row>${headerCells}</Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `siftly-analyse-produits-${stamp}.xls`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function scoreColor(val: any): string {
  const n = parseFloat(String(val));
  if (isNaN(n) || String(val).trim() === '') return '';
  if (n <= 1.5) return 'background:#F9D4C8;color:#8B2E1A;';
  if (n <= 2.5) return 'background:#FDEBD6;color:#7A4E1E;';
  if (n <= 3.5) return 'background:#FFF8E0;color:#7A6220;';
  if (n <= 4.5) return 'background:#DCF0DA;color:#2D6B2A;';
  return 'background:#B8E6B5;color:#1A5218;';
}

function marginColor(pct: number, vente: number): string {
  if (vente <= 0) return '';
  if (pct < 20) return 'color:#C0392B;font-weight:600;';
  if (pct < 40) return 'color:#E67E22;font-weight:600;';
  return 'color:#27AE60;font-weight:600;';
}

export function buildStaticHtmlReport(products: ProductData[]): string {
  const today = new Date().toLocaleDateString('fr-FR');

  type ColKey = keyof ProductData | 'frais' | 'cogs' | 'marge' | 'margepct' | 'note';
  type ColDef = { key: ColKey; label: string; group: 'id' | 'links' | 'financial' | 'cogs' | 'score' | 'mkt' };

  const cols: ColDef[] = [
    { key: 'produit',     label: 'Produit',                 group: 'id' },
    { key: 'creative',    label: 'Creative',                group: 'links' },
    { key: 'alibaba',     label: 'Alibaba',                 group: 'links' },
    { key: 'siteweb',     label: 'Site web',                group: 'links' },
    { key: 'marche',      label: "Marché d'origine",        group: 'links' },
    { key: 'concurrent',  label: 'Prix concurrent',         group: 'financial' },
    { key: 'sourcing',    label: 'Sourcing brut',           group: 'financial' },
    { key: 'poids',       label: 'Poids (kg)',              group: 'financial' },
    { key: 'modeimport',  label: 'Mode retenu',             group: 'financial' },
    { key: 'tarifbateau', label: 'Tarif bateau (F/kg)',     group: 'financial' },
    { key: 'tarifavion',  label: 'Tarif avion (F/kg)',      group: 'financial' },
    { key: 'frais',       label: 'Frais import unitaire',   group: 'financial' },
    { key: 'cac',         label: 'CAC',                     group: 'financial' },
    { key: 'livraison',   label: 'Livraison offerte',       group: 'financial' },
    { key: 'cogs',        label: 'Coût revient (COGS)',     group: 'cogs' },
    { key: 'vente',       label: 'Prix de vente',           group: 'cogs' },
    { key: 'marge',       label: 'Marge brute',             group: 'cogs' },
    { key: 'margepct',    label: 'Marge %',                 group: 'cogs' },
    { key: 'douleur',     label: 'Douleur',                 group: 'score' },
    { key: 'nonres',      label: 'Non-résolution',          group: 'score' },
    { key: 'etendue',     label: 'Étendue',                 group: 'score' },
    { key: 'impact',      label: 'Impact',                  group: 'score' },
    { key: 'waouh',       label: 'Waouh',                   group: 'score' },
    { key: 'innovant',    label: 'Innovant',                group: 'score' },
    { key: 'nonsaison',   label: 'Non-saison',              group: 'score' },
    { key: 'habitudes',   label: 'Habitudes',               group: 'score' },
    { key: 'poidsfacteur',label: 'Facteur poids',           group: 'score' },
    { key: 'note',        label: 'Note finale /5',          group: 'score' },
    { key: 'cible',       label: 'Cible',                   group: 'mkt' },
    { key: 'angle',       label: "Angle d'attaque",         group: 'mkt' },
  ];

  const groupBg: Record<string, string> = {
    id:        'background:#F7F2E4;',
    links:     'background:#DAE3E8;',
    financial: 'background:#EFE0BB;',
    cogs:      'background:#DCE6D3;',
    score:     'background:#F0DBCB;',
    mkt:       'background:#F7F2E4;',
  };

  const bodyRows = products
    .map((r, i) => {
      const frais    = calculateFreightCost(r);
      const cogs     = calculateCOGS(r);
      const marge    = calculateMargin(r);
      const margepct = calculateMarginPct(r);
      const { noteText, noteNum } = calculateNoteFinale(r);
      const venteNum = Number(r.vente);

      const vals: Record<string, any> = {
        ...r,
        modeimport:  r.modeimport === 'avion' ? '✈ Avion' : '🚢 Bateau',
        concurrent:  r.concurrent  ? formatFCFA(Number(r.concurrent))  : '',
        sourcing:    r.sourcing    ? formatFCFA(Number(r.sourcing))    : '',
        tarifbateau: r.tarifbateau ? formatFCFA(Number(r.tarifbateau)) : '',
        tarifavion:  r.tarifavion  ? formatFCFA(Number(r.tarifavion))  : '',
        cac:         r.cac         ? formatFCFA(Number(r.cac))         : '',
        livraison:   r.livraison   ? formatFCFA(Number(r.livraison))   : '',
        vente:       r.vente       ? formatFCFA(venteNum)              : '',
        frais:       formatFCFA(frais),
        cogs:        formatFCFA(cogs),
        marge:       formatFCFA(marge),
        margepct:    venteNum > 0 ? margepct.toFixed(1) + ' %' : '—',
        note:        noteText,
      };

      const rankBadge = i === 0 ? '🥇 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : String(i + 1);
      const isWinner  = i === 0;
      const rowStyle  = isWinner ? 'outline:2px solid #B8862F;outline-offset:-2px;' : '';

      const cells = cols.map(({ key, group }) => {
        const bg = groupBg[group];
        const img = r.imgSrc ? `<img src="${r.imgSrc}" alt="">` : '';

        if (key === 'produit') {
          return `<td style="${bg}"><div class="img-td"><span class="thumb">${img}</span><span class="pname">${escapeHtml(vals[key])}</span></div></td>`;
        }
        if (['creative', 'alibaba', 'siteweb'].includes(key) && vals[key]) {
          return `<td class="wide" style="${bg}"><a href="${escapeHtml(vals[key])}" target="_blank" rel="noopener">${escapeHtml(vals[key])}</a></td>`;
        }
        if (key === 'note') {
          const ns = noteNum !== null ? scoreColor(noteNum) : '';
          return `<td style="${bg}${ns}text-align:center;font-weight:600;font-family:monospace;">${escapeHtml(vals[key])}</td>`;
        }
        if (group === 'score') {
          const sc = scoreColor(vals[key]);
          return `<td style="${bg}${sc}text-align:center;font-family:monospace;">${vals[key] !== '' && vals[key] != null ? vals[key] : '—'}</td>`;
        }
        if (key === 'margepct') {
          return `<td style="${bg}${marginColor(margepct, venteNum)}text-align:right;font-family:monospace;">${escapeHtml(vals[key])}</td>`;
        }
        if (['marge', 'cogs', 'frais', 'sourcing', 'concurrent', 'tarifbateau', 'tarifavion', 'cac', 'livraison', 'vente'].includes(key)) {
          return `<td style="${bg}text-align:right;font-family:monospace;">${escapeHtml(vals[key])}</td>`;
        }
        return `<td style="${bg}">${escapeHtml(vals[key] ?? '')}</td>`;
      }).join('');

      return `<tr style="${rowStyle}"><td class="rownum">${rankBadge}</td>${cells}</tr>`;
    })
    .join('\n');

  const headCells = cols.map(({ label, group }) =>
    `<th style="${groupBg[group]}">${escapeHtml(label)}</th>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Siftly — Rapport d'Analyse Produit</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{
    --canvas:#141B32; --panel:#F7F2E4; --panel-line:#DCD3B8;
    --ink:#1E1B14; --ink-soft:#6B6353; --ink-faint:#9A8F7E;
    --gold:#B8862F; --gold-deep:#7A5A1E; --gold-wash:#EFE0BB;
    --sage:#4B6B45; --sage-wash:#DCE6D3;
    --rust-wash:#F0DBCB; --steel-wash:#DAE3E8;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'IBM Plex Sans',Arial,sans-serif;background:var(--canvas);color:var(--panel);padding:32px 20px;}
  h1{font-family:Georgia,serif;font-size:26px;font-weight:500;margin-bottom:4px;}
  .meta{font-family:monospace;font-size:12px;color:rgba(247,242,228,0.55);margin-bottom:20px;}
  .panel{background:var(--panel);border-radius:8px;padding:8px;overflow-x:auto;color:var(--ink);}
  table{width:100%;border-collapse:collapse;font-size:12.5px;}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--panel-line);white-space:nowrap;}
  th{font-family:monospace;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);border-bottom:2px solid var(--ink);position:sticky;top:0;}
  td.wide{white-space:normal;max-width:180px;overflow-wrap:break-word;}
  .rownum{font-family:monospace;color:var(--ink-soft);text-align:center;min-width:40px;}
  .img-td{display:flex;align-items:center;gap:12px;white-space:normal;min-width:280px;}
  .thumb img{width:56px;height:56px;object-fit:cover;border-radius:6px;flex-shrink:0;}
  .pname{font-weight:500;font-size:13px;}
  a{color:#7A5A1E;}
  tbody tr:hover td{filter:brightness(0.96);}
</style></head>
<body>
  <h1>Siftly — Rapport d'Analyse Produit</h1>
  <div class="meta">Export généré le ${today} · ${products.length} produit(s) · classement intelligent activé</div>
  <div class="panel">
    <table>
      <thead><tr><th class="rownum">#</th>${headCells}</tr></thead>
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
