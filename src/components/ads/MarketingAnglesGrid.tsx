'use client';

import React, { useState } from 'react';
import { Target, Copy, Check, Zap } from 'lucide-react';
import { MarketingAngle } from '../../types/adsStudio';

interface MarketingAnglesGridProps {
  angles: MarketingAngle[];
}

export const MarketingAnglesGrid: React.FC<MarketingAnglesGridProps> = ({ angles }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHook = (angle: MarketingAngle) => {
    const text = `${angle.name}\n🪝 Hook : ${angle.hook}\n🎯 Cible : ${angle.targetAudience}\n💡 Promesse : ${angle.coreBenefit}`;
    navigator.clipboard.writeText(text);
    setCopiedId(angle.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="angles-section">
      <div className="angles-section-header">
        <div className="angles-title">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3>Matrice des 4 Angles d'Attaque Publicitaires</h3>
        </div>
        <span className="angles-subtitle">Testez ces différents angles dans vos créatives TikTok & Facebook Ads</span>
      </div>

      <div className="angles-grid">
        {angles.map((ang) => {
          const isCopied = copiedId === ang.id;
          return (
            <div key={ang.id} className="angle-card">
              <div className="angle-card-top">
                <span className="angle-icon">{ang.icon}</span>
                <h4 className="angle-name">{ang.name}</h4>
                <button
                  type="button"
                  className="btn-copy-hook"
                  title="Copier cet angle"
                  onClick={() => handleCopyHook(ang)}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="angle-hook-box">
                <span className="angle-lbl">Accroche (Hook) :</span>
                <p className="angle-hook-text">{ang.hook}</p>
              </div>

              <div className="angle-meta-line">
                <span className="angle-lbl">Cible :</span>
                <span className="angle-val">{ang.targetAudience}</span>
              </div>

              <div className="angle-meta-line">
                <span className="angle-lbl">Bénéfice Clé :</span>
                <span className="angle-val text-gold-deep">{ang.coreBenefit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
