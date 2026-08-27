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
              <th className="text-center">Stock Dispo</th>
              <th className="text-center">Réservé (En cours)</th>
              <th className="text-center">Autonomie Estimée</th>
              <th className="text-right">Valeur Stock (COGS)</th>
              <th className="text-center">Santé Stock</th>
              <th className="text-center">Ajustement Rapide</th>
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
                        <span className="stock-thumb-placeholder">Photo</span>
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

                <td className="text-center">
                  <span className={`stock-qty-badge ${item.isCriticalLow ? 'low' : 'ok'}`}>
                    {item.currentStock} pcs
                  </span>
                </td>

                <td className="stock-reserved-cell">
                  {item.reservedStock > 0 ? `${item.reservedStock} pcs` : '0'}
                </td>

                <td className="stock-autonomy-cell">
                  <strong>~{item.daysOfStockLeft} jours</strong>
                  <div className="stock-autonomy-sub">({item.avgDailySales} v/j)</div>
                </td>

                <td className="stock-value-cell">
                  {formatFCFA(item.currentStock * item.unitCOGSFCFA)}
                </td>

                <td className="text-center">
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

                <td className="text-center">
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
