import React from 'react';

export const TableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="grp">
        <th colSpan={2}></th>
        <th colSpan={4} className="group-block">
          Identification
        </th>
        <th colSpan={7} className="group-block">
          Coût de revient
        </th>
        <th colSpan={4} className="group-block">
          Résultat commercial
        </th>
        <th colSpan={9} className="group-block">
          Score de validation
        </th>
        <th colSpan={1} className="group-block">
          Note
        </th>
        <th colSpan={3}></th>
      </tr>
      <tr className="cols">
        <th>#</th>
        <th>Produit</th>
        <th>Image apparente</th>
        <th>Creative</th>
        <th>Lien Alibaba</th>
        <th className="group-end">Site web</th>
        <th>Marché d'origine</th>
        <th className="num-col">Prix concurrent</th>
        <th className="num-col">Prix sourcing brut</th>
        <th className="num-col">Poids (kg)</th>
        <th className="num-col">Frais import (bateau/avion)</th>
        <th className="num-col">Coût acquisition client (CAC)</th>
        <th className="num-col group-end">Livraison offerte (coût)</th>
        <th className="num-col group-end">Coût revient (COGS)</th>
        <th className="num-col">Prix de vente</th>
        <th className="num-col group-end">Marges brutes</th>
        <th className="num-col group-end">Marge %</th>
        <th className="num-col">Douleur problème</th>
        <th className="num-col">Coût non-résolution</th>
        <th className="num-col">Étendue marché cible</th>
        <th className="num-col">Impact avant/après</th>
        <th className="num-col">Effet waouh</th>
        <th className="num-col">Caractère innovant</th>
        <th className="num-col">Non-saisonnalité</th>
        <th className="num-col">Habitudes conso.</th>
        <th className="num-col group-end">Facteur poids</th>
        <th className="num-col group-end">Note finale /5</th>
        <th>Cible</th>
        <th>Angle d'attaque</th>
        <th></th>
      </tr>
    </thead>
  );
};
