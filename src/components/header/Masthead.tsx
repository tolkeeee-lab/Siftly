import React from 'react';
import { UserMenu } from '../auth/UserMenu';

export const Masthead: React.FC = () => {
  return (
    <div className="masthead">
      <div className="masthead-left">
        <p className="eyebrow">Modèle recherche produit — E-commerce & Importation</p>
        <h1 style={{ fontFamily: "'Fraunces', serif" }}>
          Siftly <em>EAA</em>
        </h1>
        <p>
          Grille de scoring pour valider un produit gagnant : coût de revient, marge et critères de validation du
          problème résolu.
        </p>
      </div>
      <div className="masthead-right">
        <UserMenu />
        <span className="tag" style={{ marginTop: '8px', display: 'inline-block' }}>Siftly Pro</span>
        <br />
        Cotonou · 2026
      </div>
    </div>
  );
};
