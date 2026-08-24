'use client';

import React, { ChangeEvent } from 'react';
import { Download, Upload, FileText, Clipboard, Printer, Code } from 'lucide-react';
import { ProductData } from '../../types/product';
import { downloadJsonBackup, downloadHtmlReport } from '../../utils/exportHelpers';
import { parseTextSheet, parseJsonFile } from '../../utils/parsers';

interface ToolbarProps {
  products: ProductData[];
  onLoadProducts: (products: ProductData[]) => void;
  onImportTextRows: (rows: Partial<ProductData>[]) => void;
  onOpenPasteModal: () => void;
  showAutoSaveToast: boolean;
  isSyncing?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  products,
  onLoadProducts,
  onImportTextRows,
  onOpenPasteModal,
  showAutoSaveToast,
  isSyncing,
}) => {
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
      <button className="tbtn save" type="button" onClick={() => downloadJsonBackup(products)}>
        <Download className="w-3.5 h-3.5" />
        Télécharger (.json)
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

      <button className="tbtn export" type="button" onClick={() => window.print()}>
        <Printer className="w-3.5 h-3.5" />
        Exporter PDF
      </button>

      <button className="tbtn export" type="button" onClick={() => downloadHtmlReport(products)}>
        <Code className="w-3.5 h-3.5" />
        Exporter HTML
      </button>

      <span className={`toolbar-hint ${showAutoSaveToast ? 'show' : ''}`}>
        {isSyncing ? 'Synchronisation Supabase en cours...' : 'Sauvegarde automatique activée'}
      </span>
    </div>
  );
};
