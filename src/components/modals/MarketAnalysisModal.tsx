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
  UserCheck,
  Target,
  BarChart3,
  DollarSign,
  Tv,
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
  const [activeTab, setActiveTab] = useState<'pillars' | 'persona' | 'projections' | 'ads'>('pillars');

  if (!isOpen || !product) return null;

  const defaultAnalysis = getProductMarketAnalysis(product);
  const [analysis, setAnalysis] = useState<MarketAnalysisData>(defaultAnalysis);

  useEffect(() => {
    setAnalysis(getProductMarketAnalysis(product));
  }, [product]);

  const handleUpdate = (field: keyof MarketAnalysisData, value: any) => {
    setAnalysis((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonaUpdate = (field: string, value: string) => {
    setAnalysis((prev) => ({
      ...prev,
      buyerPersona: {
        ...(prev.buyerPersona || { targetAge: '', genderRatio: '', professionalCategory: '', psychologicalTrigger: '' }),
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (onSaveAnalysis) {
      onSaveAnalysis(product.id, analysis);
    }
    onClose();
  };

  const persona = analysis.buyerPersona || {
    targetAge: '25 - 50 ans',
    genderRatio: 'Mixte (50% H / 50% F)',
    professionalCategory: 'Salariés, Cadres & Commerçants urbains',
    psychologicalTrigger: 'Gain de temps, Confort immédiat & Fierté',
  };

  const projections = analysis.marketProjections || {
    conservativeUnits: 250,
    conservativeRevenueFCFA: 3750000,
    conservativeProfitFCFA: 1875000,
    aggressiveUnits: 1200,
    aggressiveRevenueFCFA: 18000000,
    aggressiveProfitFCFA: 9000000,
  };

  const ads = analysis.adBenchmarks || {
    estimatedCPMFCFA: 1600,
    targetCTR: 2.8,
    targetConversionRate: 11.5,
    maxAllowedCPAFCFA: 3500,
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
                🔬 Dossier d'Intelligence Marché Poussé : #{product.seq} {product.produit}
              </h2>
              <p className="market-modal-subtitle">
                Radar 360°, Persona Cible, Projections de Chiffre d'Affaires & Benchmarks Médias COD Afrique.
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="market-modal-tabs-nav">
          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pillars')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Radar & 5 Piliers Stratégiques</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'persona' ? 'active' : ''}`}
            onClick={() => setActiveTab('persona')}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>2. Buyer Persona & Cible</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'projections' ? 'active' : ''}`}
            onClick={() => setActiveTab('projections')}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Projections & Pénétration CA</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>4. Benchmarks Pubs Facebook/TikTok</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="market-modal-body">
          {/* TAB 1: 5 PILIERS */}
          {activeTab === 'pillars' && (
            <>
              {/* Verdict Banner */}
              <div className="verdict-banner">
                <div className="verdict-tag">🎯 VERDICT STRATÉGIQUE IA EAA (Éditable) :</div>
                <textarea
                  className="verdict-textarea"
                  rows={2}
                  value={analysis.strategicVerdict}
                  onChange={(e) => handleUpdate('strategicVerdict', e.target.value)}
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
                <div className="pillar-box blue-pillar">
                  <div className="pillar-header">
                    <span className="pillar-icon">🎯</span>
                    <div>
                      <h4 className="pillar-title">1. Pourquoi ce Produit Doit Être Utilisé</h4>
                      <span className="pillar-hint">Transformation vécue par le client & utilité concrète</span>
                    </div>
                  </div>
                  <textarea
                    className="pillar-textarea"
                    rows={4}
                    value={analysis.reasonsToUse}
                    onChange={(e) => handleUpdate('reasonsToUse', e.target.value)}
                  />
                </div>

                <div className="pillar-box emerald-pillar">
                  <div className="pillar-header">
                    <span className="pillar-icon">🛑</span>
                    <div>
                      <h4 className="pillar-title">2. Problèmes & Frustrations Résolus</h4>
                      <span className="pillar-hint">Quelles douleurs profondes ce produit élimine-t-il ?</span>
                    </div>
                  </div>
                  <textarea
                    className="pillar-textarea"
                    rows={4}
                    value={analysis.problemsSolved}
                    onChange={(e) => handleUpdate('problemsSolved', e.target.value)}
                  />
                </div>

                <div className="pillar-box gold-pillar">
                  <div className="pillar-header">
                    <span className="pillar-icon">💎</span>
                    <div>
                      <h4 className="pillar-title">3. Pourquoi Il Vaut Vraiment La Peine</h4>
                      <span className="pillar-hint">Rentabilité unitaire, marge nette & effet waouh</span>
                    </div>
                  </div>
                  <textarea
                    className="pillar-textarea"
                    rows={4}
                    value={analysis.whyItsWorthIt}
                    onChange={(e) => handleUpdate('whyItsWorthIt', e.target.value)}
                  />
                </div>

                <div className="pillar-box amber-pillar">
                  <div className="pillar-header">
                    <span className="pillar-icon">⚠️</span>
                    <div>
                      <h4 className="pillar-title">4. Points d'Attention Critiques (Logistique / Poids)</h4>
                      <span className="pillar-hint">Vérifications obligatoires avant commande fournisseur</span>
                    </div>
                  </div>
                  <textarea
                    className="pillar-textarea"
                    rows={4}
                    value={analysis.criticalAttentionPoints}
                    onChange={(e) => handleUpdate('criticalAttentionPoints', e.target.value)}
                  />
                </div>

                <div className="pillar-box red-pillar full-width">
                  <div className="pillar-header">
                    <span className="pillar-icon">💣</span>
                    <div>
                      <h4 className="pillar-title">5. Pourquoi Il Pourrait Échouer Malgré Tout</h4>
                      <span className="pillar-hint">Facteurs d'échec : mauvaise qualité usine, retours massifs, saturation</span>
                    </div>
                  </div>
                  <textarea
                    className="pillar-textarea warning-font"
                    rows={4}
                    value={analysis.failureRisks}
                    onChange={(e) => handleUpdate('failureRisks', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* TAB 2: BUYER PERSONA */}
          {activeTab === 'persona' && (
            <div className="persona-section-card">
              <h3 className="persona-title">👤 Profil Démographique & Persona de l'Acheteur Idéal</h3>
              <p className="persona-subtitle">
                Définissez qui achète ce produit en Afrique de l'Ouest pour orienter vos publicités et vos messages de vente.
              </p>

              <div className="persona-inputs-grid">
                <div className="persona-field-box">
                  <label>🎂 Tranche d'Âge Cible</label>
                  <input
                    type="text"
                    className="persona-input"
                    value={persona.targetAge}
                    onChange={(e) => handlePersonaUpdate('targetAge', e.target.value)}
                  />
                </div>

                <div className="persona-field-box">
                  <label>⚧ Répartition Genre</label>
                  <input
                    type="text"
                    className="persona-input"
                    value={persona.genderRatio}
                    onChange={(e) => handlePersonaUpdate('genderRatio', e.target.value)}
                  />
                </div>

                <div className="persona-field-box full-width">
                  <label>💼 Catégorie Socio-Professionnelle (CSP)</label>
                  <input
                    type="text"
                    className="persona-input"
                    value={persona.professionalCategory}
                    onChange={(e) => handlePersonaUpdate('professionalCategory', e.target.value)}
                  />
                </div>

                <div className="persona-field-box full-width">
                  <label>🧠 Déclencheur d'Achat Psychologique Principal</label>
                  <textarea
                    className="persona-input"
                    rows={2}
                    value={persona.psychologicalTrigger}
                    onChange={(e) => handlePersonaUpdate('psychologicalTrigger', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTIONS FINANCIÈRES */}
          {activeTab === 'projections' && (
            <div className="projections-section-card">
              <h3 className="persona-title">📊 Simulateur de Pénétration de Marché & CA Prévisionnel</h3>
              <p className="persona-subtitle">
                Potentiel financier estimé selon la part de l'audience ciblée atteinte en Afrique de l'Ouest.
              </p>

              <div className="projections-comparison-grid">
                {/* Conservative */}
                <div className="proj-card conservative">
                  <div className="proj-badge">🌱 Hypothèse Prudente (0.03% Cible)</div>
                  <div className="proj-big-num">{projections.conservativeUnits} pièces</div>
                  <div className="proj-row">
                    <span>CA Prévisionnel :</span>
                    <strong>{formatFCFA(projections.conservativeRevenueFCFA)}</strong>
                  </div>
                  <div className="proj-row highlight-green">
                    <span>Bénéfice Net en Poche :</span>
                    <strong>+{formatFCFA(projections.conservativeProfitFCFA)}</strong>
                  </div>
                </div>

                {/* Aggressive */}
                <div className="proj-card aggressive">
                  <div className="proj-badge gold">🚀 Hypothèse Scaling (0.12% Cible)</div>
                  <div className="proj-big-num text-gold-deep">{projections.aggressiveUnits} pièces</div>
                  <div className="proj-row">
                    <span>CA Prévisionnel :</span>
                    <strong>{formatFCFA(projections.aggressiveRevenueFCFA)}</strong>
                  </div>
                  <div className="proj-row highlight-green">
                    <span>Bénéfice Net en Poche :</span>
                    <strong>+{formatFCFA(projections.aggressiveProfitFCFA)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AD BENCHMARKS */}
          {activeTab === 'ads' && (
            <div className="ad-benchmarks-section-card">
              <h3 className="persona-title">📣 Métriques & Benchmarks Publicitaires Recommandés</h3>
              <p className="persona-subtitle">
                Objectifs de performance publicitaire (Facebook & TikTok Ads) pour rester rentable en COD.
              </p>

              <div className="ad-kpi-grid">
                <div className="ad-kpi-box">
                  <span className="ad-kpi-lbl">CPM Moyen Estimé (Afrique)</span>
                  <strong className="ad-kpi-val">{formatFCFA(ads.estimatedCPMFCFA)}</strong>
                  <span className="ad-kpi-desc">Pour 1 000 impressions vidéo</span>
                </div>

                <div className="ad-kpi-box">
                  <span className="ad-kpi-lbl">CTR Cible Attendu</span>
                  <strong className="ad-kpi-val text-blue-600">{ads.targetCTR}%</strong>
                  <span className="ad-kpi-desc">Taux de clic sur la créative vidéo</span>
                </div>

                <div className="ad-kpi-box">
                  <span className="ad-kpi-lbl">Taux de Conversion Landing</span>
                  <strong className="ad-kpi-val text-emerald-600">{ads.targetConversionRate}%</strong>
                  <span className="ad-kpi-desc">Visiteurs ➔ Commandes passées</span>
                </div>

                <div className="ad-kpi-box highlight-amber">
                  <span className="ad-kpi-lbl">CPA Plafond Maximum</span>
                  <strong className="ad-kpi-val text-amber-700">{formatFCFA(ads.maxAllowedCPAFCFA)}</strong>
                  <span className="ad-kpi-desc">Coût d'acquisition max avant risque de perte</span>
                </div>
              </div>
            </div>
          )}

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
