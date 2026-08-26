'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Users, ShieldAlert, Zap, Globe, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { ProductData, MarketAnalysisData } from '../../types/product';
import { getProductMarketAnalysis } from '../../utils/marketIntelligence';
import { formatFCFA } from '../../utils/formatters';

interface MarketAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
  onSaveAnalysis?: (productId: string, data: MarketAnalysisData) => void;
}

export const MarketAnalysisModal: React.FC<MarketAnalysisModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveAnalysis,
}) => {
  if (!isOpen || !product) return null;

  const defaultAnalysis = getProductMarketAnalysis(product);
  const [analysis, setAnalysis] = useState<MarketAnalysisData>(defaultAnalysis);

  useEffect(() => {
    setAnalysis(getProductMarketAnalysis(product));
  }, [product]);

  const handleUpdate = (field: keyof MarketAnalysisData, value: any) => {
    setAnalysis((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSaveAnalysis) {
      onSaveAnalysis(product.id, analysis);
    }
    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="market-analysis-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="market-modal-header">
          <div className="market-modal-title-group">
            <Sparkles className="w-5 h-5 text-gold" />
            <div>
              <h2 className="market-modal-title">
                🔬 Analyse de Marché & Intelligence EAA : #{product.seq} {product.produit}
              </h2>
              <p className="market-modal-subtitle">
                Radar de saturation, taille d'audience estimée en Afrique de l'Ouest, risque de retour COD et verdict stratégique.
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="market-modal-body">
          {/* Strategic Verdict Alert Banner */}
          <div className="verdict-banner">
            <div className="verdict-tag">🎯 VERDICT STRATÉGIQUE IA EAA</div>
            <textarea
              className="verdict-textarea"
              rows={2}
              value={analysis.strategicVerdict}
              onChange={(e) => handleUpdate('strategicVerdict', e.target.value)}
              title="Cliquez pour modifier le verdict"
            />
          </div>

          {/* 4 Market KPI Cards */}
          <div className="market-kpi-grid">
            <div className="market-kpi-box">
              <span className="kpi-icon">📊</span>
              <label>Saturation du Marché</label>
              <select
                className="market-select-in"
                value={analysis.saturationScore}
                onChange={(e) => handleUpdate('saturationScore', e.target.value)}
              >
                <option value="low">🟢 Faible (Océan Bleu)</option>
                <option value="medium">🟡 Modérée (Quelques Vendeurs)</option>
                <option value="high">🔴 Forte (Marché Saturé)</option>
              </select>
            </div>

            <div className="market-kpi-box">
              <span className="kpi-icon">👥</span>
              <label>Taille d'Audience Cible (TAM)</label>
              <div className="market-num-input-wrap">
                <input
                  type="number"
                  step="0.5"
                  className="market-num-in"
                  value={analysis.audienceSizeMillion}
                  onChange={(e) => handleUpdate('audienceSizeMillion', Number(e.target.value) || 1)}
                />
                <span>Millions de personnes</span>
              </div>
            </div>

            <div className="market-kpi-box">
              <span className="kpi-icon">🔥</span>
              <label>Score Viralité TikTok (sur 10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="market-num-in text-center font-bold text-amber-500"
                value={analysis.viralFactorScore}
                onChange={(e) => handleUpdate('viralFactorScore', Number(e.target.value) || 5)}
              />
            </div>

            <div className="market-kpi-box">
              <span className="kpi-icon">🛵</span>
              <label>Risque de Retour COD</label>
              <select
                className="market-select-in"
                value={analysis.codReturnRisk}
                onChange={(e) => handleUpdate('codReturnRisk', e.target.value)}
              >
                <option value="low">🟢 Faible (&lt; 15% retours)</option>
                <option value="medium">🟡 Moyen (15% - 25% retours)</option>
                <option value="high">🔴 Élevé (&gt; 25% retours)</option>
              </select>
            </div>
          </div>

          {/* Target Countries & Scaling Strategy */}
          <div className="market-detail-section">
            <h4 className="detail-section-title">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>Zone Géographique Prioritaire (Afrique de l'Ouest & Centrale) :</span>
            </h4>
            <div className="countries-tags-row">
              {analysis.targetCountries.map((country, idx) => (
                <span key={idx} className="country-badge-item">
                  📍 {country}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Angle & Barrier to entry */}
          <div className="market-advice-grid">
            <div className="advice-card">
              <strong className="advice-title">💡 Angle Publicitaire Gagnant Recommandé :</strong>
              <textarea
                className="advice-textarea"
                rows={2}
                value={analysis.recommendedAdAngle}
                onChange={(e) => handleUpdate('recommendedAdAngle', e.target.value)}
              />
            </div>

            <div className="advice-card">
              <strong className="advice-title">🛡️ Barrière à l'Entrée & Logistique :</strong>
              <textarea
                className="advice-textarea"
                rows={2}
                value={analysis.keyBarrierToEntry}
                onChange={(e) => handleUpdate('keyBarrierToEntry', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="market-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn-save-analysis" onClick={handleSave}>
            <Save className="w-4 h-4" />
            <span>Enregistrer l'Analyse de Marché</span>
          </button>
        </div>
      </div>
    </div>
  );
};
