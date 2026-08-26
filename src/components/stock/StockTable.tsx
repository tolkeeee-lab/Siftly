'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Plus, Minus, Package } from 'lucide-react';
import { StockItem } from '../../types/stockTypes';
import { formatFCFA } from '../../utils/formatters';

interface StockTableProps {
  items: StockItem[];
  onAddStockQuick: (productId: string, productName: string, delta: number) => void;
}

export const StockTable: React.FC<StockTableProps> = ({ items, onAddStockQuick }) => {
  return (
    <div className="stock-table-card">
      <div className="stock-table-header">
        <Package className="w-5 h-5 text-gold-deep" />
        <h3>État du Stock Physique par Article</h3>
      </div>

      <div className="stock-table-wrap">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Article</th>
              <th style={{ textAlign: 'center' }}>Stock Dispo</th>
              <th style={{ textAlign: 'center' }}>Réservé (En cours)</th>
              <th style={{ textAlign: 'center' }}>Autonomie Estimée</th>
              <th style={{ textAlign: 'right' }}>Valeur Stock (COGS)</th>
              <th style={{ textAlign: 'center' }}>Santé Stock</th>
              <th style={{ textAlign: 'center' }}>Ajustement Rapide</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId} className={item.isCriticalLow ? 'stock-row-warning' : ''}>
                <td>
                  <div className="stock-prod-cell">
                    <div className="stock-prod-thumb">
                      {item.productImg ? (
                        <img src={item.productImg} alt={item.productName} />
                      ) : (
                        <span style={{ fontSize: '10px', color: '#999' }}>Photo</span>
                      )}
                    </div>
                    <div>
                      <strong className="stock-item-name">{item.productName}</strong>
                      <div className="stock-item-cogs">
                        Prix vente : {formatFCFA(item.sellingPriceFCFA)} · COGS : {formatFCFA(item.unitCOGSFCFA)}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ textAlign: 'center' }}>
                  <span className={`stock-qty-badge ${item.isCriticalLow ? 'low' : 'ok'}`}>
                    {item.currentStock} pcs
                  </span>
                </td>

                <td style={{ textAlign: 'center', color: '#8E44AD', fontWeight: 600 }}>
                  {item.reservedStock > 0 ? `${item.reservedStock} pcs` : '0'}
                </td>

                <td style={{ textAlign: 'center', fontSize: '12px' }}>
                  <strong>~{item.daysOfStockLeft} jours</strong>
                  <div style={{ fontSize: '10.5px', color: '#888' }}>({item.avgDailySales} v/j)</div>
                </td>

                <td style={{ textAlign: 'right', fontWeight: 600, color: '#7A5A1E' }}>
                  {formatFCFA(item.currentStock * item.unitCOGSFCFA)}
                </td>

                <td style={{ textAlign: 'center' }}>
                  {item.isCriticalLow ? (
                    <span className="stock-alert-pill">
                      <AlertCircle className="w-3 h-3 inline mr-1" /> Recommander !
                    </span>
                  ) : (
                    <span className="stock-ok-pill">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" /> En Stock
                    </span>
                  )}
                </td>

                <td style={{ textAlign: 'center' }}>
                  <div className="stock-inline-actions">
                    <button
                      type="button"
                      className="btn-stock-delta minus"
                      title="Retirer 1 pièce (Casse / Perte)"
                      onClick={() => onAddStockQuick(item.productId, item.productName, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      className="btn-stock-delta plus"
                      title="Ajouter 5 pièces (Arrivage rapide)"
                      onClick={() => onAddStockQuick(item.productId, item.productName, 5)}
                    >
                      <Plus className="w-3 h-3" /> 5
                    </button>
                    <button
                      type="button"
                      className="btn-stock-delta plus-big"
                      title="Ajouter 20 pièces"
                      onClick={() => onAddStockQuick(item.productId, item.productName, 20)}
                    >
                      <Plus className="w-3 h-3" /> 20
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
