'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, CheckCircle, Percent, DollarSign, Filter, Search } from 'lucide-react';
import { ProductRevenueItem } from '../../types/financeTypes';
import { formatFCFA } from '../../utils/formatters';

interface ProductRevenueBreakdownTableProps {
  productItems: ProductRevenueItem[];
  globalGrossRevenueFCFA: number;
}

export const ProductRevenueBreakdownTable: React.FC<ProductRevenueBreakdownTableProps> = ({
  productItems,
  globalGrossRevenueFCFA,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'with_sales'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = productItems.filter((item) => {
    const matchesFilter = filterMode === 'all' || item.deliveredOrdersCount > 0;
    const matchesSearch = searchTerm === '' || item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalDeliveredFromTable = productItems.reduce((sum, item) => sum + item.deliveredRevenueFCFA, 0);

  return (
    <div className="product-revenue-card">
      <div className="product-revenue-header">
        <div>
          <div className="product-revenue-title-wrap">
            <Package className="w-5 h-5 text-gold-deep" />
            <h3 className="product-revenue-title">
              📦 Décomposition du CA & Bénéfice Produit par Produit (Sur Livraisons Réelles)
            </h3>
          </div>
          <p className="product-revenue-subtitle">
            Seules les commandes effectivement <strong>livrées et encaissées (Cash COD)</strong> sont comptabilisées dans le Chiffre d'Affaires.
          </p>
        </div>

        <div className="product-revenue-actions">
          <div className="prod-search-input-wrap">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              className="prod-search-input"
              placeholder="Rechercher produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="prod-filter-pills">
            <button
              type="button"
              className={`prod-filter-pill ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              Tous ({productItems.length})
            </button>
            <button
              type="button"
              className={`prod-filter-pill ${filterMode === 'with_sales' ? 'active' : ''}`}
              onClick={() => setFilterMode('with_sales')}
            >
              Avec Livraisons ({productItems.filter((p) => p.deliveredOrdersCount > 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="product-revenue-table-wrap">
        <table className="product-revenue-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th className="text-center">Colis Livrés</th>
              <th className="text-center">Taux Livraison</th>
              <th className="text-right">CA Encaissé (FCFA)</th>
              <th className="text-right">Coût COGS</th>
              <th className="text-right">Frais Livraisons</th>
              <th className="text-right">Bénéfice Net Produit</th>
              <th className="text-center">Part CA Global</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400 font-mono text-xs">
                  Aucun produit ne correspond à ces critères.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const isWinner = idx === 0 && item.deliveredRevenueFCFA > 0;

                return (
                  <tr key={item.productId} className={isWinner ? 'winner-row' : ''}>
                    {/* Product Name & Img */}
                    <td>
                      <div className="prod-cell-meta">
                        {item.productImg ? (
                          <img src={item.productImg} alt={item.productName} className="prod-mini-thumb" />
                        ) : (
                          <div className="prod-mini-thumb placeholder">📦</div>
                        )}
                        <div>
                          <strong className="prod-table-name">{item.productName}</strong>
                          {isWinner && <span className="winner-badge">🏆 TOP 1 VENTES</span>}
                        </div>
                      </div>
                    </td>

                    {/* Delivered count */}
                    <td className="text-center font-mono">
                      <strong>{item.deliveredOrdersCount}</strong>
                      <span className="text-slate-400 text-xs"> / {item.totalOrdersCount} cmds</span>
                    </td>

                    {/* Delivery Rate */}
                    <td className="text-center font-mono">
                      <span className={`delivery-rate-pill ${item.deliveryRatePct >= 75 ? 'good' : item.deliveryRatePct > 0 ? 'avg' : 'none'}`}>
                        {item.deliveryRatePct}%
                      </span>
                    </td>

                    {/* Delivered Revenue */}
                    <td className="text-right font-mono font-bold text-slate-900">
                      {formatFCFA(item.deliveredRevenueFCFA)}
                    </td>

                    {/* COGS */}
                    <td className="text-right font-mono text-slate-500 text-xs">
                      - {formatFCFA(item.cogsFCFA)}
                    </td>

                    {/* Delivery Fees */}
                    <td className="text-right font-mono text-slate-500 text-xs">
                      - {formatFCFA(item.deliveryFeesFCFA + item.returnLossesFCFA)}
                    </td>

                    {/* Net Profit */}
                    <td className="text-right font-mono font-extrabold">
                      <span className={item.netProfitFCFA >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {item.netProfitFCFA >= 0 ? '+' : ''}{formatFCFA(item.netProfitFCFA)}
                      </span>
                    </td>

                    {/* Share of global revenue */}
                    <td className="text-center font-mono text-xs font-bold text-slate-600">
                      {item.deliveredRevenueFCFA > 0 ? (
                        <div className="share-gauge-wrap">
                          <span>{item.pctOfGlobalRevenue}%</span>
                          <div className="share-mini-bar">
                            <div className="share-bar-fill" style={{ width: `${Math.min(100, item.pctOfGlobalRevenue)}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="pnl-table-total-row">
              <td><strong>TOTAL CA & BÉNÉFICES CONSOLIDÉS</strong></td>
              <td className="text-center font-mono font-bold">
                {productItems.reduce((sum, i) => sum + i.deliveredOrdersCount, 0)} livrés
              </td>
              <td className="text-center font-mono font-bold">-</td>
              <td className="text-right font-mono font-extrabold text-gold-deep">
                {formatFCFA(totalDeliveredFromTable)}
              </td>
              <td className="text-right font-mono text-slate-600 text-xs">
                - {formatFCFA(productItems.reduce((sum, i) => sum + i.cogsFCFA, 0))}
              </td>
              <td className="text-right font-mono text-slate-600 text-xs">
                - {formatFCFA(productItems.reduce((sum, i) => sum + i.deliveryFeesFCFA + i.returnLossesFCFA, 0))}
              </td>
              <td className="text-right font-mono font-extrabold text-emerald-600">
                +{formatFCFA(productItems.reduce((sum, i) => sum + i.netProfitFCFA, 0))}
              </td>
              <td className="text-center font-mono font-bold">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
