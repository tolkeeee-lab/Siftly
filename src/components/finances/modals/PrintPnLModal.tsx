'use client';

import React from 'react';
import { X, Printer, DollarSign, CheckCircle } from 'lucide-react';
import { PnLStatement } from '../../../types/financeTypes';
import { formatFCFA } from '../../../utils/formatters';

interface PrintPnLModalProps {
  pnl: PnLStatement;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintPnLModal: React.FC<PrintPnLModalProps> = ({ pnl, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="one-pager-overlay open" onClick={onClose}>
      <div className="one-pager-container po-print-box" onClick={(e) => e.stopPropagation()}>
        {/* Header Controls */}
        <div className="one-pager-header-controls no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="w-5 h-5 text-gold-deep" />
            <span style={{ fontFamily: 'Georgia', fontSize: '16px', fontWeight: 600 }}>
              Compte de Résultat & Bilan Net
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="tbtn save" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button type="button" className="rowdel" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document */}
        <div className="po-printable-area">
          <div className="po-doc-masthead">
            <div>
              <h1 className="po-doc-title">COMPTE DE RÉSULTAT CONSOLIDÉ (P&L)</h1>
              <div className="po-doc-ref">Bilan Financier & Rentabilité Nette</div>
              <div className="po-doc-date">Date : {new Date().toLocaleDateString('fr-FR')}</div>
            </div>
            <div className="po-doc-status-badge" style={{ background: pnl.netProfitFCFA >= 0 ? '#D4EFDF' : '#FADBD8', color: pnl.netProfitFCFA >= 0 ? '#196F3D' : '#922B21' }}>
              Marge Nette : {pnl.netMarginPct}%
            </div>
          </div>

          {/* Statement Table */}
          <table className="po-doc-table" style={{ margin: '18px 0' }}>
            <thead>
              <tr>
                <th>Ligne Comptable</th>
                <th style={{ textAlign: 'right' }}>Montant (FCFA)</th>
                <th style={{ textAlign: 'right' }}>% du CA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>(+) Chiffre d'Affaires Cash Encaissé (COD)</strong></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#7A5A1E' }}>{formatFCFA(pnl.grossRevenueFCFA)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>100.0%</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;(-) Coût d'Achat Marchandises (Sourcing + Fret)</td>
                <td style={{ textAlign: 'right', color: '#c0392b' }}>- {formatFCFA(pnl.cogsFCFA)}</td>
                <td style={{ textAlign: 'right' }}>{pnl.grossRevenueFCFA > 0 ? Math.round((pnl.cogsFCFA / pnl.grossRevenueFCFA) * 100) : 0}%</td>
              </tr>
              <tr style={{ background: '#FAF8F2', fontWeight: 700 }}>
                <td>(=) MARGE BRUTE COMMERCIALE</td>
                <td style={{ textAlign: 'right' }}>{formatFCFA(pnl.grossProfitFCFA)}</td>
                <td style={{ textAlign: 'right' }}>{pnl.grossMarginPct}%</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;(-) Dépenses Publicitaires (Facebook / TikTok Ads)</td>
                <td style={{ textAlign: 'right', color: '#c0392b' }}>- {formatFCFA(pnl.totalAdSpendFCFA)}</td>
                <td style={{ textAlign: 'right' }}>{pnl.grossRevenueFCFA > 0 ? Math.round((pnl.totalAdSpendFCFA / pnl.grossRevenueFCFA) * 100) : 0}%</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;(-) Frais de Livraison & Commissions Livreurs</td>
                <td style={{ textAlign: 'right', color: '#c0392b' }}>- {formatFCFA(pnl.totalDeliveryFeesFCFA)}</td>
                <td style={{ textAlign: 'right' }}>{pnl.grossRevenueFCFA > 0 ? Math.round((pnl.totalDeliveryFeesFCFA / pnl.grossRevenueFCFA) * 100) : 0}%</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;(-) Frais Généraux & Dépenses Diverses</td>
                <td style={{ textAlign: 'right', color: '#c0392b' }}>- {formatFCFA(pnl.totalGeneralExpensesFCFA)}</td>
                <td style={{ textAlign: 'right' }}>{pnl.grossRevenueFCFA > 0 ? Math.round((pnl.totalGeneralExpensesFCFA / pnl.grossRevenueFCFA) * 100) : 0}%</td>
              </tr>
              <tr style={{ background: '#141B32', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                <td style={{ color: '#fff' }}>(=) BÉNÉFICE NET RÉEL EN POCHE</td>
                <td style={{ textAlign: 'right', color: pnl.netProfitFCFA >= 0 ? '#2ECC71' : '#E74C3C' }}>{formatFCFA(pnl.netProfitFCFA)}</td>
                <td style={{ textAlign: 'right', color: '#fff' }}>{pnl.netMarginPct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
