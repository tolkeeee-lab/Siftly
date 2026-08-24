import React from 'react';

export const HelpNotes: React.FC = () => {
  return (
    <>
      <p className="note">
        Coût de revient = prix sourcing brut + frais d'importation unitaire (poids × tarif au kg selon le mode
        choisi : bateau ou avion) + coût d'acquisition client (CAC) + coût de la livraison offerte · Marge brute =
        prix de vente − coût de revient · Marge % = (marge brute ÷ prix de vente) × 100 · Note finale = moyenne des 9
        critères de score (/5) · Cliquez sur une image pour l'agrandir, ou sur la vignette vide pour en importer une
        · Vos saisies sont sauvegardées automatiquement dans ce navigateur : rouvrez simplement ce même fichier plus
        tard, tout sera encore là · « Télécharger une sauvegarde » exporte un .json de secours (utile si vous changez
        de navigateur/PC) ; « Restaurer depuis un fichier » le réinjecte dans le tableau · « Importer une fiche produit
        (.txt) » lit un fichier texte au format « Clé: valeur » (ex : Produit: ..., Prix sourcing brut: 1800, Douleur: 5)
        — plusieurs fiches dans un même fichier peuvent être séparées par une ligne « --- » · « Coller une fiche
        produit » permet de coller ce format ou un JSON directement dans une fenêtre, sans passer par un fichier.
      </p>
      <div className="foot">
        <div className="updated">Modèle basé sur la grille EAA — mise à jour le 23 août 2026</div>
      </div>
    </>
  );
};
