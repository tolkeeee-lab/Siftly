'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Package, Video, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { ComparisonAnalysis } from '../../types/compareTypes';
import { formatFCFA } from '../../utils/formatters';

interface CompareWinnerCardProps {
  analysis: ComparisonAnalysis;
}

export const CompareWinnerCard: React.FC<CompareWinnerCardProps> = ({ analysis }) => {
  const winner = analysis.winnerProduct;
  if (!winner) return null;

  return (
    <div className="compare-winner-banner">
      <div className="winner-banner-left">
        <div className="winner-trophy-badge">
          <Trophy className="w-6 h-6 text-gold" />
        </div>
        <div>
          <span className="winner-subtitle">🥇 VAINQUEUR DE LA COMPARAISON</span>
          <h2 className="winner-product-name">{winner.produit || 'Produit Gagnant'}</h2>
          <div className="winner-meta-pills">
            <span>Prix Vente : <strong>{formatFCFA(Number(winner.vente) || 0)}</strong></span>
            <span>·</span>
            <span>Cible : <strong>{winner.cible || 'Grand public'}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons to Sourcing and Ads */}
      <div className="winner-actions-right">
        <Link href="/sourcing" className="btn-winner-action sourcing">
          <Package className="w-4 h-4" />
          <span>📦 Commander ce Winner (PO)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/ads" className="btn-winner-action ads">
          <Video className="w-4 h-4" />
          <span>🎬 Générer les Scripts Ads</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
