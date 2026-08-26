'use client';

import React, { useState } from 'react';
import { Target, Copy, Check, Zap, Edit3, RotateCcw } from 'lucide-react';
import { MarketingAngle } from '../../types/adsStudio';

interface MarketingAnglesGridProps {
  angles: MarketingAngle[];
}

export const MarketingAnglesGrid: React.FC<MarketingAnglesGridProps> = ({ angles: initialAngles }) => {
  const [angles, setAngles] = useState<MarketingAngle[]>(initialAngles);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync when initialAngles change
  React.useEffect(() => {
    setAngles(initialAngles);
  }, [initialAngles]);

  const handleUpdateField = (id: string, field: keyof MarketingAngle, value: string) => {
    setAngles((prev) =>
      prev.map((ang) => (ang.id === id ? { ...ang, [field]: value } : ang))
    );
  };

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
          <h3>Matrice des 4 Angles d'Attaque Publicitaires (100% Modifiables)</h3>
        </div>
        <span className="angles-subtitle">Cliquez directement dans les champs pour personnaliser les accroches et cibles</span>
      </div>

      <div className="angles-grid">
        {angles.map((ang) => {
          const isCopied = copiedId === ang.id;
          return (
            <div key={ang.id} className="angle-card">
              <div className="angle-card-top">
                <span className="angle-icon">{ang.icon}</span>
                <input
                  type="text"
                  className="angle-name-in font-bold"
                  value={ang.name}
                  onChange={(e) => handleUpdateField(ang.id, 'name', e.target.value)}
                  title="Modifier le nom de l'angle"
                />
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
                <span className="angle-lbl">Accroche (Hook 0-3s) :</span>
                <textarea
                  className="angle-hook-textarea"
                  rows={2}
                  value={ang.hook}
                  onChange={(e) => handleUpdateField(ang.id, 'hook', e.target.value)}
                  title="Cliquez pour modifier l'accroche"
                />
              </div>

              <div className="angle-meta-line">
                <span className="angle-lbl">Cible :</span>
                <input
                  type="text"
                  className="angle-meta-in"
                  value={ang.targetAudience}
                  onChange={(e) => handleUpdateField(ang.id, 'targetAudience', e.target.value)}
                  title="Cliquez pour modifier la cible"
                />
              </div>

              <div className="angle-meta-line">
                <span className="angle-lbl">Bénéfice Clé :</span>
                <input
                  type="text"
                  className="angle-meta-in"
                  value={ang.coreBenefit}
                  onChange={(e) => handleUpdateField(ang.id, 'coreBenefit', e.target.value)}
                  title="Cliquez pour modifier le bénéfice clé"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
