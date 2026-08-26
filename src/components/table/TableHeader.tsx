'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig, SortFieldKey, VisibleColumnGroups } from '../../types/tableFeatures';

interface TableHeaderProps {
  visibleGroups: VisibleColumnGroups;
  sortConfig: SortConfig | null;
  onToggleSort: (key: SortFieldKey) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  visibleGroups,
  sortConfig,
  onToggleSort,
}) => {
  const renderSortIndicator = (key: SortFieldKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-70 inline ml-1" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-amber-500 inline ml-1 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-500 inline ml-1 font-bold" />
    );
  };

  const sortHeaderClass = (key: SortFieldKey, extraClass = '') => {
    const isSorted = sortConfig?.key === key;
    return `cursor-pointer select-none group transition-colors hover:text-amber-600 ${isSorted ? 'text-amber-700 font-semibold' : ''} ${extraClass}`.trim();
  };

  return (
    <thead>
      <tr className="grp">
        <th colSpan={2}></th>
        {visibleGroups.identification && (
          <th colSpan={5} className="group-block">
            Identification & Liens
          </th>
        )}
        {visibleGroups.costs && (
          <th colSpan={6} className="group-block">
            Coût de revient
          </th>
        )}
        {visibleGroups.results && (
          <th colSpan={4} className="group-block">
            Résultat commercial
          </th>
        )}
        {visibleGroups.scoring && (
          <th colSpan={9} className="group-block">
            Score de validation
          </th>
        )}
        <th colSpan={1} className="group-block">
          Note
        </th>
        {visibleGroups.marketing && <th colSpan={2} className="group-block">Marketing</th>}
        <th></th>
      </tr>

      <tr className="cols">
        <th>#</th>
        <th
          className={sortHeaderClass('produit')}
          onClick={() => onToggleSort('produit')}
          title="Trier par Nom de produit"
        >
          Produit {renderSortIndicator('produit')}
        </th>

        {visibleGroups.identification && (
          <>
            <th>Image</th>
            <th>Creative</th>
            <th>Lien Alibaba</th>
            <th>Site web</th>
            <th className="group-end">Marché</th>
          </>
        )}

        {visibleGroups.costs && (
          <>
            <th
              className={sortHeaderClass('concurrent', 'num-col')}
              onClick={() => onToggleSort('concurrent')}
              title="Trier par Prix concurrent"
            >
              Prix concurrent (FCFA) {renderSortIndicator('concurrent')}
            </th>
            <th
              className={sortHeaderClass('sourcing', 'num-col')}
              onClick={() => onToggleSort('sourcing')}
              title="Trier par Prix sourcing"
            >
              Prix sourcing brut (FCFA) {renderSortIndicator('sourcing')}
            </th>
            <th
              className={sortHeaderClass('poids', 'num-col')}
              onClick={() => onToggleSort('poids')}
              title="⚖️ Trier : Du Moins Lourd au Plus Lourd (↗️ / ↘️)"
            >
              ⚖️ Poids (kg) {renderSortIndicator('poids')}
            </th>
            <th className="num-col">Frais import (FCFA)</th>
            <th
              className={sortHeaderClass('cac', 'num-col')}
              onClick={() => onToggleSort('cac')}
              title="Trier par CAC"
            >
              CAC (FCFA) {renderSortIndicator('cac')}
            </th>
            <th
              className={sortHeaderClass('livraison', 'num-col group-end')}
              onClick={() => onToggleSort('livraison')}
              title="Trier par Livraison"
            >
              Livraison offerte (FCFA) {renderSortIndicator('livraison')}
            </th>
          </>
        )}

        {visibleGroups.results && (
          <>
            <th
              className={sortHeaderClass('cogs', 'num-col group-end')}
              onClick={() => onToggleSort('cogs')}
              title="Trier par Coût de revient (COGS)"
            >
              Coût revient COGS (FCFA) {renderSortIndicator('cogs')}
            </th>
            <th
              className={sortHeaderClass('vente', 'num-col')}
              onClick={() => onToggleSort('vente')}
              title="Trier par Prix de vente"
            >
              Prix de vente (FCFA) {renderSortIndicator('vente')}
            </th>
            <th
              className={sortHeaderClass('marge', 'num-col group-end')}
              onClick={() => onToggleSort('marge')}
              title="Trier par Marge brute"
            >
              Marges brutes (FCFA) {renderSortIndicator('marge')}
            </th>
            <th
              className={sortHeaderClass('margepct', 'num-col group-end')}
              onClick={() => onToggleSort('margepct')}
              title="Trier par Marge %"
            >
              Marge % {renderSortIndicator('margepct')}
            </th>
          </>
        )}

        {visibleGroups.scoring && (
          <>
            <th className="num-col">Douleur</th>
            <th className="num-col">Non-résolution</th>
            <th className="num-col">Étendue</th>
            <th className="num-col">Impact</th>
            <th className="num-col">Waouh</th>
            <th className="num-col">Innovant</th>
            <th className="num-col">Non-saison</th>
            <th className="num-col">Habitudes</th>
            <th className="num-col group-end">Facteur poids</th>
          </>
        )}

        <th
          className={sortHeaderClass('note', 'num-col group-end')}
          onClick={() => onToggleSort('note')}
          title="Trier par Note finale"
        >
          Note finale /5 {renderSortIndicator('note')}
        </th>

        {visibleGroups.marketing && (
          <>
            <th>Cible</th>
            <th>Angle d'attaque</th>
          </>
        )}

        <th></th>
      </tr>
    </thead>
  );
};
