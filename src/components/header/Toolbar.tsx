'use client';

import React, { ChangeEvent } from 'react';
import {
  Download,
  Upload,
  FileText,
  Clipboard,
  Printer,
  Code,
  RefreshCw,
  DollarSign,
  FileSpreadsheet,
  Camera,
  Table2,
} from 'lucide-react';
import { ProductData } from '../../types/product';
import {
  downloadJsonBackup,
  downloadHtmlReport,
  downloadCsvExport,
  downloadExcelXml,
  downloadGoogleSheetsCsv,
} from '../../utils/exportHelpers';
import { parseTextSheet, parseJsonFile } from '../../utils/parsers';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface ToolbarProps {
  products: ProductData[];
  totalProductsCount?: number;
  onLoadProducts: (products: ProductData[]) => void;
  onImportTextRows: (rows: Partial<ProductData>[]) => void;
  onOpenPasteModal: () => void;
  onOpenCurrencyModal?: () => void;
  onOpenImageSourcingModal?: () => void;
  onRefreshSupabase?: () => void;
  showAutoSaveToast: boolean;
  isSyncing?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  products,
  totalProductsCount,
  onLoadProducts,
  onImportTextRows,
  onOpenPasteModal,
  onOpenCurrencyModal,
  onOpenImageSourcingModal,
  onRefreshSupabase,
  showAutoSaveToast,
  isSyncing,
}) => {
  const isFiltered = totalProductsCount !== undefined && products.length !== totalProductsCount;
  const countLabel = `(${products.length})`;

  const handleLoadJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseJsonFile(reader.result as string);
        if (rows.length > 0) {
          onLoadProducts(rows);
        } else {
          alert('Le fichier JSON ne contient aucun produit valide.');
        }
      } catch (err: any) {
        alert('Erreur lors de la lecture du fichier JSON : ' + (err?.message || 'fichier invalide'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportTxt = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseTextSheet(reader.result as string);
      if (rows.length === 0) {
        alert('Aucune fiche reconnue. Format attendu : "Clé: valeur", séparé par "---".');
        return;
      }
      onImportTextRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="toolbar">
      <PWAInstallButton />

      {onRefreshSupabase && (
        <button
          className="tbtn load"
          type="button"
          onClick={onRefreshSupabase}
          disabled={isSyncing}
          title="Forcer la synchronisation instantanée avec Supabase Cloud"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchro...' : 'Synchro Cloud'}</span>
        </button>
      )}

      {onOpenCurrencyModal && (
        <button
          className="tbtn load"
          type="button"
          onClick={onOpenCurrencyModal}
          title="Convertisseur rapide vers Franc CFA (FCFA)"
        >
          <DollarSign className="w-3.5 h-3.5 text-gold" />
          <span>Convertisseur FCFA</span>
        </button>
      )}

      {onOpenImageSourcingModal && (
        <button
          className="tbtn load image-sourcing-btn"
          type="button"
          onClick={onOpenImageSourcingModal}
          title="Rechercher des fournisseurs et analyser le marché à partir d'une photo de produit"
        >
          <Camera className="w-3.5 h-3.5 text-gold-deep" />
          <span>📸 Sourcer par Image</span>
        </button>
      )}

      <button
        className="tbtn export"
        type="button"
        onClick={() => downloadHtmlReport(products)}
        title={isFiltered 
          ? `Exporter le Dossier de Cadrage des ${products.length} produit(s) filtrés (sur ${totalProductsCount} au total)`
          : `Exporter le Dossier de Cadrage complet (${products.length} produits)`}
      >
        <FileText className="w-3.5 h-3.5 text-gold" />
        <span>📁 Dossier HTML {countLabel}</span>
      </button>

      <button className="tbtn save" type="button" onClick={() => downloadJsonBackup(products)}>
        <Download className="w-3.5 h-3.5" />
        Sauvegarde (.json)
      </button>

      <button
        className="tbtn export"
        type="button"
        onClick={() => downloadGoogleSheetsCsv(products)}
        title={`Exporter vers Google Sheets les ${products.length} produit(s) sélectionnés (CSV optimisé + copie automatique au format presse-papier pour un Ctrl+V direct)`}
      >
        <Table2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Sheets {countLabel}</span>
      </button>

      <button
        className="tbtn export"
        type="button"
        onClick={() => downloadExcelXml(products)}
        title={`Exporter vers Excel (.xls) les ${products.length} produit(s) sélectionnés`}
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        Excel {countLabel}
      </button>

      <button
        className="tbtn export"
        type="button"
        onClick={() => downloadCsvExport(products)}
        title={`Exporter vers CSV universel les ${products.length} produit(s) sélectionnés`}
      >
        <FileText className="w-3.5 h-3.5 text-sky-400" />
        CSV {countLabel}
      </button>

      <label className="tbtn load">
        <Upload className="w-3.5 h-3.5" />
        Restaurer (.json)
        <input type="file" accept="application/json" onChange={handleLoadJson} />
      </label>

      <label className="tbtn load">
        <FileText className="w-3.5 h-3.5" />
        Importer (.txt)
        <input type="file" accept=".txt,text/plain" onChange={handleImportTxt} />
      </label>

      <button className="tbtn load" type="button" onClick={onOpenPasteModal}>
        <Clipboard className="w-3.5 h-3.5" />
        Coller une fiche
      </button>

      <span className={`toolbar-hint ${showAutoSaveToast || isSyncing ? 'show' : ''}`}>
        {isSyncing ? 'Synchronisation Supabase en cours...' : 'Sauvegarde automatique activée'}
      </span>
    </div>
  );
};
