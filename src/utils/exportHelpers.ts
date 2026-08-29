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

export function buildFramedCatalogHtml(products: ProductData[]): string {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate Global Stats
  let totalMarginPct = 0;
  let totalVente = 0;
  let totalWeight = 0;
  let totalMarginFCFA = 0;
  let validProductsCount = products.length;
  let favoritesCount = 0;
  let avionCount = 0;
  let bateauCount = 0;

  products.forEach((p) => {
    if (p.isFavorite) favoritesCount++;
    if (p.modeimport === 'avion') avionCount++;
    else bateauCount++;

    const vente = Number(p.vente) || 0;
    const margin = calculateMargin(p);
    const marginPct = calculateMarginPct(p);
    const weight = Number(p.poids) || 0;

    totalVente += vente;
    totalMarginFCFA += margin;
    totalMarginPct += marginPct;
    totalWeight += weight;
  });

  const avgMarginPct = validProductsCount > 0 ? (totalMarginPct / validProductsCount).toFixed(1) : '0';
  const avgVente = validProductsCount > 0 ? Math.round(totalVente / validProductsCount) : 0;
  const avgWeight = validProductsCount > 0 ? (totalWeight / validProductsCount).toFixed(2) : '0';

  // Build Table of Contents / Summary Grid
  const tocItems = products.map((p, i) => {
    const rank = i + 1;
    const rankBadge = rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`;
    const { noteText, noteNum } = calculateNoteFinale(p);
    const margin = calculateMargin(p);
    const marginPct = calculateMarginPct(p);
    const vente = Number(p.vente) || 0;
    const imgSrc = p.imgSrc || '';

    return `
      <a href="#produit-${rank}" class="toc-card" data-title="${escapeHtml((p.produit || '').toLowerCase())}">
        <div class="toc-card-header">
          <span class="toc-rank ${rank === 1 ? 'gold' : ''}">${rankBadge}</span>
          ${p.isFavorite ? '<span class="toc-fav-badge">⭐ Favori</span>' : ''}
          <span class="toc-score">${noteText || '—'}</span>
        </div>
        <div class="toc-card-body">
          <div class="toc-thumb">
            ${imgSrc ? `<img src="${escapeHtml(imgSrc)}" alt="" loading="lazy">` : '<div class="toc-no-img">📦</div>'}
          </div>
          <div class="toc-info">
            <h4 class="toc-title">${escapeHtml(p.produit || 'Produit sans nom')}</h4>
            <div class="toc-metrics">
              <span class="toc-price">${formatFCFA(vente)}</span>
              <span class="toc-margin ${marginPct >= 40 ? 'green' : ''}">+${formatFCFA(margin)} (${marginPct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  // Build Full Framed Product Cards
  const productCards = products.map((p, i) => {
    const rank = i + 1;
    const rankBadge = rank === 1 ? '🥇 RANG #1' : rank === 2 ? '🥈 RANG #2' : rank === 3 ? '🥉 RANG #3' : `RANG #${rank}`;
    const frais = calculateFreightCost(p);
    const cogs = calculateCOGS(p);
    const marge = calculateMargin(p);
    const margePct = calculateMarginPct(p);
    const { noteText, noteNum } = calculateNoteFinale(p);
    const vente = Number(p.vente) || 0;
    const sourcing = Number(p.sourcing) || 0;
    const concurrent = Number(p.concurrent) || 0;
    const cac = Number(p.cac) || 0;
    const livraison = Number(p.livraison) || 0;
    const poids = Number(p.poids) || 0;
    const isAvion = p.modeimport === 'avion';

    // Break-even orders approximation for 100k FCFA fixed costs
    const breakEvenUnits = marge > 0 ? Math.ceil(100000 / marge) : '—';

    // 9 Scoring Criteria list
    const criteria = [
      { label: '1. Douleur / Problème résolu', val: p.douleur },
      { label: '2. Coût de non-résolution', val: p.nonres },
      { label: '3. Étendue du marché', val: p.etendue },
      { label: '4. Impact avant / après', val: p.impact },
      { label: '5. Effet waouh en vidéo', val: p.waouh },
      { label: '6. Caractère innovant', val: p.innovant },
      { label: '7. Non-saisonnalité', val: p.nonsaison },
      { label: '8. Habitudes de consommation', val: p.habitudes },
      { label: '9. Facteur poids & transport', val: p.poidsfacteur },
    ];

    const criteriaRows = criteria.map((c) => {
      const num = parseFloat(String(c.val || 0));
      const widthPct = !isNaN(num) ? Math.min(100, Math.max(0, (num / 5) * 100)) : 0;
      const scoreColorClass = num >= 4 ? 'score-high' : num >= 3 ? 'score-med' : 'score-low';

      return `
        <div class="crit-row">
          <span class="crit-label">${escapeHtml(c.label)}</span>
          <div class="crit-bar-wrap">
            <div class="crit-bar ${scoreColorClass}" style="width: ${widthPct}%"></div>
          </div>
          <span class="crit-val">${c.val !== '' && c.val != null ? c.val + '/5' : '—'}</span>
        </div>
      `;
    }).join('');

    return `
      <section id="produit-${rank}" class="product-page-frame ${rank === 1 ? 'winner-frame' : ''}">
        <!-- Top Frame Header -->
        <div class="frame-header">
          <div class="frame-header-left">
            <div class="frame-badge-line">
              <span class="frame-rank-badge ${rank === 1 ? 'gold' : ''}">${rankBadge}</span>
              ${p.isFavorite ? '<span class="frame-fav-pill">⭐ RETENU EN SHORTLIST</span>' : ''}
              <span class="frame-category">${escapeHtml(p.category || 'Maison & Confort')}</span>
              <span class="frame-origin">Origine : ${escapeHtml(p.marche || 'Chine')}</span>
            </div>
            <h2 class="frame-title">${escapeHtml(p.produit || 'Produit sans nom')}</h2>
          </div>
          <div class="frame-header-right">
            <div class="score-box">
              <span class="score-box-label">NOTE GLOBALE</span>
              <span class="score-box-val">${noteText || '—'}</span>
            </div>
          </div>
        </div>

        <!-- 2 Columns Layout: Media & Financials -->
        <div class="frame-grid">
          <!-- Left Column: Image & Direct Links -->
          <div class="frame-col-left">
            <div class="frame-image-wrap">
              ${p.imgSrc ? `<img src="${escapeHtml(p.imgSrc)}" alt="${escapeHtml(p.produit || '')}" class="frame-main-img">` : '<div class="frame-no-img"><span>📦 Pas d\'image enregistrée</span></div>'}
            </div>
            
            <div class="frame-links-card">
              <span class="section-micro-title">LIENS & SOURCING</span>
              <div class="links-list">
                ${p.alibaba ? `<a href="${escapeHtml(p.alibaba)}" target="_blank" rel="noopener" class="link-btn alibaba">🏭 Fournisseur Alibaba ↗</a>` : '<span class="link-btn disabled">Fournisseur : Non renseigné</span>'}
                ${p.creative ? `<a href="${escapeHtml(p.creative)}" target="_blank" rel="noopener" class="link-btn creative">🎬 Vidéo Publicitaire / Créative ↗</a>` : '<span class="link-btn disabled">Publicité : Non renseignée</span>'}
                ${p.siteweb ? `<a href="${escapeHtml(p.siteweb)}" target="_blank" rel="noopener" class="link-btn site">🌐 Site Web Concurrent ↗</a>` : '<span class="link-btn disabled">Concurrent : Non renseigné</span>'}
              </div>
            </div>
          </div>

          <!-- Right Column: Full COD Unit Economics -->
          <div class="frame-col-right">
            <div class="finance-card">
              <span class="section-micro-title">UNIT ECONOMICS & CALCUL DU COÛT DE REVIENT (COD)</span>
              
              <div class="finance-table">
                <div class="fin-row">
                  <span class="fin-label">Prix d'Achat Usine (Sourcing) :</span>
                  <span class="fin-val font-mono">${formatFCFA(sourcing)}</span>
                </div>
                <div class="fin-row">
                  <span class="fin-label">Poids Unitaire :</span>
                  <span class="fin-val font-mono">${poids > 0 ? poids + ' kg' : 'Non précisé'}</span>
                </div>
                <div class="fin-row">
                  <span class="fin-label">Fret Transport (${isAvion ? '✈️ Avion Express' : '🚢 Bateau Maritime'}) :</span>
                  <span class="fin-val font-mono">${formatFCFA(frais)}</span>
                </div>
                <div class="fin-row">
                  <span class="fin-label">Budget Pub Estimé (CAC / Commande) :</span>
                  <span class="fin-val font-mono">${formatFCFA(cac)}</span>
                </div>
                <div class="fin-row">
                  <span class="fin-label">Livraison Locale Offerte :</span>
                  <span class="fin-val font-mono">${formatFCFA(livraison)}</span>
                </div>
                <div class="fin-row total-cogs">
                  <span class="fin-label"><strong>COÛT DE REVIENT TOTAL (COGS) :</strong></span>
                  <span class="fin-val font-mono"><strong>${formatFCFA(cogs)}</strong></span>
                </div>
              </div>

              <!-- Selling Price & Margin Highlight Banner -->
              <div class="margin-highlight-box ${margePct >= 40 ? 'green-box' : margePct > 0 ? 'orange-box' : 'red-box'}">
                <div class="margin-col">
                  <span class="m-title">PRIX DE VENTE CONSEILLÉ</span>
                  <span class="m-price font-mono">${formatFCFA(vente)}</span>
                  ${concurrent > 0 ? `<span class="m-sub">Prix concurrent constaté : ${formatFCFA(concurrent)}</span>` : ''}
                </div>
                <div class="margin-col text-right">
                  <span class="m-title">BÉNÉFICE NET / VENTE</span>
                  <span class="m-benefit font-mono">+${formatFCFA(marge)}</span>
                  <span class="m-pct font-mono">Marge nette : ${vente > 0 ? margePct.toFixed(1) + '%' : '0%'}</span>
                </div>
              </div>

              <!-- Break Even COD Insight -->
              <div class="breakeven-banner">
                <span class="be-icon">🎯</span>
                <div class="be-text">
                  <strong>Seuil de Rentabilité COD :</strong> Il vous faut environ <strong>${breakEvenUnits} ventes</strong> pour amortir 100 000 FCFA de dépenses fixes.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row: 9 Validation Criteria & Marketing Plan -->
        <div class="frame-lower-grid">
          <!-- 9 Criteria Scoring -->
          <div class="criteria-card">
            <span class="section-micro-title">GRILLE DES 9 CRITÈRES DE VALIDATION</span>
            <div class="criteria-list">
              ${criteriaRows}
            </div>
          </div>

          <!-- Marketing Strategy: Persona & Hook -->
          <div class="marketing-card">
            <span class="section-micro-title">STRATÉGIE MARKETING & ANGLE D'ATTAQUE</span>
            
            <div class="mkt-block">
              <span class="mkt-badge">🎯 CIBLE & PERSONA IDÉAL</span>
              <p class="mkt-desc">${escapeHtml(p.cible || 'Définissez la cible prioritaire pour ce produit (ex: Mères de famille, Travailleurs nomades, Conducteurs de motos...).')}</p>
            </div>

            <div class="mkt-block mt-3">
              <span class="mkt-badge gold">⚡ ANGLE D'ATTAQUE PUBLICITAIRE</span>
              <p class="mkt-desc">${escapeHtml(p.angle || 'Rédigez l\'accroche et la promesse irrésistible de votre publicité Facebook / TikTok.')}</p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="frame-footer">
          <a href="#sommaire" class="back-to-top-btn">↑ Retour au Sommaire</a>
          <span class="frame-footer-stamp">Fiche n°${rank} · Siftly Intelligence E-commerce</span>
        </div>
      </section>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <title>Siftly — Dossier de Cadrage Produit Global</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Georgia&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090D1A;
      --card-bg: #0F172A;
      --card-border: #1E293B;
      --gold: #F59E0B;
      --gold-light: #FCD34D;
      --gold-bg: rgba(245, 158, 11, 0.12);
      --emerald: #10B981;
      --emerald-bg: rgba(16, 185, 129, 0.12);
      --rose: #F43F5E;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      padding: 0;
      margin: 0;
      scroll-behavior: smooth;
    }

    .font-mono { font-family: 'IBM Plex Mono', monospace; }

    /* Top Floating Print & Action Bar */
    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-weight: 800;
      font-size: 18px;
      color: var(--gold-light);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn {
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: #0F172A;
      font-weight: 700;
      font-size: 13px;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .print-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); }

    /* Main Container */
    .catalog-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 20px 80px;
    }

    /* Executive Hero Header */
    .executive-hero {
      background: linear-gradient(180deg, #131E36 0%, #0F172A 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 16px;
      padding: 36px 32px;
      margin-bottom: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .hero-badge {
      display: inline-block;
      background: var(--gold-bg);
      border: 1px solid var(--gold);
      color: var(--gold-light);
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .hero-h1 {
      font-family: 'Georgia', serif;
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .hero-subtitle {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 24px;
    }
    
    /* Stats Bar */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }
    .stat-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 16px;
    }
    .stat-label {
      display: block;
      font-size: 11px;
      color: var(--text-dim);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-val {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 4px;
    }
    .stat-val.gold { color: var(--gold-light); }
    .stat-val.green { color: var(--emerald); }

    /* Sommaire / Table of contents */
    .toc-section {
      margin-bottom: 50px;
    }
    .section-header-wrap {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .toc-search-input {
      background: #1E293B;
      border: 1px solid #334155;
      color: #FFFFFF;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      width: 260px;
      outline: none;
    }
    .toc-search-input:focus { border-color: var(--gold); }
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }
    .toc-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 12px;
      text-decoration: none;
      color: var(--text);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s ease;
    }
    .toc-card:hover {
      border-color: var(--gold);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }
    .toc-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .toc-rank {
      background: #1E293B;
      color: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .toc-rank.gold { background: var(--gold); color: #0F172A; }
    .toc-fav-badge {
      background: var(--gold-bg);
      border: 1px solid var(--gold);
      color: var(--gold-light);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }
    .toc-score { color: var(--gold-light); font-weight: 700; }
    .toc-card-body {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .toc-thumb {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background: #1E293B;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toc-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .toc-no-img { font-size: 20px; }
    .toc-info { flex: 1; min-width: 0; }
    .toc-title {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }
    .toc-metrics {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .toc-price { color: var(--text-muted); }
    .toc-margin { color: var(--gold-light); font-weight: 700; }
    .toc-margin.green { color: var(--emerald); }

    /* Framed Product Cards */
    .product-page-frame {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      position: relative;
    }
    .product-page-frame.winner-frame {
      border: 2px solid var(--gold);
      box-shadow: 0 20px 45px rgba(245, 158, 11, 0.15);
    }
    .frame-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 18px;
      margin-bottom: 24px;
    }
    .frame-badge-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 11px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .frame-rank-badge {
      background: #1E293B;
      color: #FFFFFF;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 6px;
    }
    .frame-rank-badge.gold { background: var(--gold); color: #0F172A; }
    .frame-fav-pill {
      background: var(--gold-bg);
      border: 1px solid var(--gold);
      color: var(--gold-light);
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 6px;
    }
    .frame-category, .frame-origin {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      padding: 3px 9px;
      border-radius: 6px;
    }
    .frame-title {
      font-family: 'Georgia', serif;
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .score-box {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid var(--gold);
      border-radius: 10px;
      padding: 10px 16px;
      text-align: center;
      min-width: 110px;
    }
    .score-box-label {
      display: block;
      font-size: 9px;
      color: var(--gold-light);
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .score-box-val {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: 'IBM Plex Mono', monospace;
    }

    /* Grid Layouts */
    .frame-grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    @media (max-width: 850px) {
      .frame-grid { grid-template-columns: 1fr; }
    }

    .frame-image-wrap {
      width: 100%;
      height: 260px;
      border-radius: 12px;
      background: #090D1A;
      border: 1px solid var(--card-border);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .frame-main-img { width: 100%; height: 100%; object-fit: cover; }
    .frame-no-img { color: var(--text-dim); font-size: 13px; text-align: center; }

    .section-micro-title {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-light);
      font-family: 'IBM Plex Mono', monospace;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .links-list { display: flex; flex-direction: column; gap: 8px; }
    .link-btn {
      display: block;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s ease;
      text-align: center;
    }
    .link-btn.alibaba { background: rgba(249, 115, 22, 0.15); color: #FB923C; border: 1px solid rgba(249, 115, 22, 0.3); }
    .link-btn.creative { background: rgba(244, 63, 94, 0.15); color: #FB7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .link-btn.site { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
    .link-btn.disabled { background: rgba(255, 255, 255, 0.03); color: var(--text-dim); border: 1px solid rgba(255, 255, 255, 0.05); }
    .link-btn:hover:not(.disabled) { filter: brightness(1.2); }

    /* Finance Table */
    .finance-card {
      background: #090D1A;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
    }
    .finance-table { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .fin-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-muted);
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      padding-bottom: 4px;
    }
    .fin-row.total-cogs {
      border-top: 1px solid var(--card-border);
      border-bottom: none;
      padding-top: 8px;
      color: #FFFFFF;
      font-size: 14px;
    }
    .fin-val { color: #FFFFFF; }

    /* Margin Highlight Box */
    .margin-highlight-box {
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .margin-highlight-box.green-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.08));
      border: 1px solid var(--emerald);
    }
    .margin-highlight-box.orange-box {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.08));
      border: 1px solid var(--gold);
    }
    .margin-highlight-box.red-box {
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(244, 63, 94, 0.08));
      border: 1px solid var(--rose);
    }
    .m-title { display: block; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .m-price { font-size: 20px; font-weight: 800; color: #FFFFFF; }
    .m-sub { display: block; font-size: 11px; color: var(--text-dim); }
    .m-benefit { font-size: 22px; font-weight: 800; color: var(--emerald); }
    .m-pct { display: block; font-size: 12px; font-weight: 700; color: var(--gold-light); }
    .text-right { text-align: right; }

    .breakeven-banner {
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12.5px;
      color: var(--text-muted);
    }
    .be-icon { font-size: 16px; }

    /* Lower Grid (Criteria & Marketing) */
    .frame-lower-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 20px;
    }
    @media (max-width: 768px) {
      .frame-lower-grid { grid-template-columns: 1fr; }
    }

    .criteria-card, .marketing-card {
      background: #090D1A;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
    }
    .crit-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 11.5px;
      margin-bottom: 7px;
    }
    .crit-label { width: 170px; color: var(--text-muted); flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .crit-bar-wrap {
      flex: 1;
      height: 6px;
      background: #1E293B;
      border-radius: 3px;
      overflow: hidden;
    }
    .crit-bar { height: 100%; border-radius: 3px; }
    .crit-bar.score-high { background: var(--emerald); }
    .crit-bar.score-med { background: var(--gold); }
    .crit-bar.score-low { background: var(--rose); }
    .crit-val { width: 32px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-align: right; color: #FFFFFF; font-weight: 600; }

    .mkt-block {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 12px;
    }
    .mt-3 { margin-top: 12px; }
    .mkt-badge {
      display: inline-block;
      font-size: 10.5px;
      font-weight: 700;
      font-family: 'IBM Plex Mono', monospace;
      color: #60A5FA;
      margin-bottom: 6px;
    }
    .mkt-badge.gold { color: var(--gold-light); }
    .mkt-desc { font-size: 13px; color: var(--text); line-height: 1.45; }

    /* Footer of each frame */
    .frame-footer {
      border-top: 1px solid var(--card-border);
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      color: var(--text-dim);
    }
    .back-to-top-btn {
      color: var(--gold-light);
      text-decoration: none;
      font-weight: 600;
      font-family: 'IBM Plex Mono', monospace;
    }
    .back-to-top-btn:hover { text-decoration: underline; }

    /* Print Styles (Strict A4 Framing) */
    @media print {
      body { background: #FFFFFF; color: #000000; }
      .top-action-bar, .toc-section, .back-to-top-btn { display: none !important; }
      .catalog-container { max-width: 100%; padding: 0; margin: 0; }
      .executive-hero { border: 2px solid #000; background: #FFF; color: #000; box-shadow: none; page-break-after: always; }
      .hero-h1, .stat-val { color: #000 !important; }
      .product-page-frame {
        page-break-after: always;
        page-break-inside: avoid;
        border: 1px solid #CCC !important;
        background: #FFF !important;
        color: #000 !important;
        box-shadow: none !important;
        margin-bottom: 0;
        padding: 20px;
      }
      .frame-title, .m-price, .fin-val, .mkt-desc, .crit-val { color: #000 !important; }
      .finance-card, .criteria-card, .marketing-card, .margin-highlight-box {
        background: #F8F9FA !important;
        border: 1px solid #DDD !important;
      }
    }
  </style>
  <script>
    function filterToc() {
      const q = document.getElementById('tocSearch').value.toLowerCase();
      const cards = document.querySelectorAll('.toc-card');
      cards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        card.style.display = title.includes(q) ? 'flex' : 'none';
      });
    }
  </script>
</head>
<body>

  <!-- Floating Sticky Action Bar -->
  <div class="top-action-bar">
    <div class="brand-title">
      <span>✨ SIFTLY</span>
      <span style="font-size: 13px; color: #94A3B8; font-weight: 400;">| Dossier de Cadrage Produit</span>
    </div>
    <button type="button" class="print-btn" onclick="window.print()">
      <span>🖨️ Imprimer / Enregistrer en PDF</span>
    </button>
  </div>

  <div class="catalog-container">
    <!-- Executive Cover / Summary -->
    <header class="executive-hero" id="sommaire">
      <span class="hero-badge">CATALOGUE OFFICIEL DE CADRAGE & SOURCING</span>
      <h1 class="hero-h1">Dossier d'Analyse & Cadrage Produits</h1>
      <p class="hero-subtitle">Rapport d'intelligence e-commerce généré le ${today} · Évaluation rigoureuse des opportunités Cash On Delivery (COD).</p>
      
      <div class="stats-bar">
        <div class="stat-box">
          <span class="stat-label">Total Produits Analysés</span>
          <span class="stat-val">${validProductsCount}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Shortlist (Favoris)</span>
          <span class="stat-val gold">${favoritesCount}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Marge Moyenne</span>
          <span class="stat-val green">${avgMarginPct}%</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Prix Vente Moyen</span>
          <span class="stat-val">${formatFCFA(avgVente)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Poids Moyen</span>
          <span class="stat-val font-mono">${avgWeight} kg</span>
        </div>
      </div>
    </header>

    <!-- Table of contents / Quick Navigation Grid -->
    <section class="toc-section">
      <div class="section-header-wrap">
        <h3 class="section-title">📑 Table des Matières (${validProductsCount} fiches)</h3>
        <input type="text" id="tocSearch" class="toc-search-input" placeholder="🔍 Filtrer un produit dans le sommaire..." onkeyup="filterToc()">
      </div>
      <div class="toc-grid">
        ${tocItems}
      </div>
    </section>

    <!-- All Framed Product Pages -->
    <main class="products-list-wrap">
      ${productCards}
    </main>
  </div>

</body>
</html>`;
}

export function downloadHtmlReport(products: ProductData[]): void {
  const html = buildFramedCatalogHtml(products);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dossier-cadrage-produits-siftly-${stamp}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
