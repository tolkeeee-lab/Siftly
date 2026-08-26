'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Users,
  ShieldAlert,
  Zap,
  Globe,
  CheckCircle2,
  Save,
  AlertTriangle,
  Flame,
  HelpCircle,
  Package,
  Layers,
  Scale,
  Ban,
} from 'lucide-react';
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
            <Sparkles className="w-5 h-5 text-gold flex-shrink-0" />
            <div>
              <h2 className="market-modal-title">
                🔬 Dossier d'Intelligence Marché EAA : #{product.seq} {product.produit}
              </h2>
              <p className="market-modal-subtitle">
                Analyse à 360° : Pourquoi l'utiliser, problèmes résolus, points d'attention logistique et risques d'échec cachés.
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
            <div className="verdict-tag">🎯 VERDICT STRATÉGIQUE IA EAA (Éditable) :</div>
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
              <label>Taille d'Audience (TAM)</label>
              <div className="market-num-input-wrap">
                <input
                  type="number"
                  step="0.5"
                  className="market-num-in"
                  value={analysis.audienceSizeMillion}
                  onChange={(e) => handleUpdate('audienceSizeMillion', Number(e.target.value) || 1)}
                />
                <span>Millions</span>
              </div>
            </div>

            <div className="market-kpi-box">
              <span className="kpi-icon">🔥</span>
              <label>Score Viralité TikTok (/10)</label>
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
              <label>Risque Retour COD (Moto)</label>
              <select
                className="market-select-in"
                value={analysis.codReturnRisk}
                onChange={(e) => handleUpdate('codReturnRisk', e.target.value)}
              >
                <option value="low">🟢 Faible (&lt; 15% retours)</option>
                <option value="medium">🟡 Moyen (15% - 25%)</option>
                <option value="high">🔴 Élevé (&gt; 25%)</option>
              </select>
            </div>
          </div>

          {/* 5 DEEP-DIVE STRATEGIC PILLARS */}
          <div className="pillars-grid">
            {/* PILLAR 1: Pourquoi l'utiliser */}
            <div className="pillar-box blue-pillar">
              <div className="pillar-header">
                <span className="pillar-icon">🎯</span>
                <div>
                  <h4 className="pillar-title">1. Pourquoi ce Produit Doit Être Utilisé (Usage & Bénéfices)</h4>
                  <span className="pillar-hint">Transformation vécue par le client et utilité concrète</span>
                </div>
              </div>
              <textarea
                className="pillar-textarea"
                rows={4}
                value={analysis.reasonsToUse}
                onChange={(e) => handleUpdate('reasonsToUse', e.target.value)}
                placeholder="Listez les raisons clés pour lesquelles le client doit acheter ce produit..."
              />
            </div>

            {/* PILLAR 2: Problèmes résolus */}
            <div className="pillar-box emerald-pillar">
              <div className="pillar-header">
                <span className="pillar-icon">🛑</span>
                <div>
                  <h4 className="pillar-title">2. Problèmes & Frustrations Concrètes Résolus</h4>
                  <span className="pillar-hint">Quelles douleurs profondes ce produit élimine-t-il ?</span>
                </div>
              </div>
              <textarea
                className="pillar-textarea"
                rows={4}
                value={analysis.problemsSolved}
                onChange={(e) => handleUpdate('problemsSolved', e.target.value)}
                placeholder="Listez les problèmes résolus par le produit..."
              />
            </div>

            {/* PILLAR 3: Pourquoi il vaut la peine */}
            <div className="pillar-box gold-pillar">
              <div className="pillar-header">
                <span className="pillar-icon">💎</span>
                <div>
                  <h4 className="pillar-title">3. Pourquoi Il Vaut Vraiment La Peine (Proposition de Valeur)</h4>
                  <span className="pillar-hint">Rentabilité unitaire, marge en poche et effet waouh</span>
                </div>
              </div>
              <textarea
                className="pillar-textarea"
                rows={4}
                value={analysis.whyItsWorthIt}
                onChange={(e) => handleUpdate('whyItsWorthIt', e.target.value)}
                placeholder="Expliquez pourquoi ce produit est rentable et irrésistible..."
              />
            </div>

            {/* PILLAR 4: Points d'attention & vigilance */}
            <div className="pillar-box amber-pillar">
              <div className="pillar-header">
                <span className="pillar-icon">⚠️</span>
                <div>
                  <h4 className="pillar-title">4. Points d'Attention Critiques (Logistique, Poids, Qualité)</h4>
                  <span className="pillar-hint">Vérifications obligatoires avant commande fournisseur</span>
                </div>
              </div>
              <textarea
                className="pillar-textarea"
                rows={4}
                value={analysis.criticalAttentionPoints}
                onChange={(e) => handleUpdate('criticalAttentionPoints', e.target.value)}
                placeholder="Poids, fragilité, normes électriques, tests usine..."
              />
            </div>

            {/* PILLAR 5: Pourquoi il pourrait échouer malgré tout */}
            <div className="pillar-box red-pillar full-width">
              <div className="pillar-header">
                <span className="pillar-icon">💣</span>
                <div>
                  <h4 className="pillar-title">5. Pourquoi Il Pourrait Échouer Malgré Tout (Facteurs d'Échec Cachés)</h4>
                  <span className="pillar-hint">Anticipation des pièges : mauvaise qualité usine, retours massifs, saturation cachée</span>
                </div>
              </div>
              <textarea
                className="pillar-textarea warning-font"
                rows={4}
                value={analysis.failureRisks}
                onChange={(e) => handleUpdate('failureRisks', e.target.value)}
                placeholder="Pourquoi ce produit risquerait d'échouer malgré une bonne note..."
              />
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
        </div>

        {/* Footer Actions */}
        <div className="market-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn-save-analysis" onClick={handleSave}>
            <Save className="w-4 h-4" />
            <span>Enregistrer l'Analyse Complète</span>
          </button>
        </div>
      </div>
    </div>
  );
};
