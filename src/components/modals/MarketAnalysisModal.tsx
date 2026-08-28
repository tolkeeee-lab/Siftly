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
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  Loader2,
  Wand2,
  BrainCircuit,
} from 'lucide-react';
import { ProductData, MarketAnalysisData } from '../../types/product';
import { getProductMarketAnalysis } from '../../utils/marketIntelligence';
import { extractSmartAdSpyQueries } from '../../utils/adSpyKeywords';
import { formatFCFA } from '../../utils/formatters';
import { calculateMargin } from '../../utils/calculations';

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
  const [activeTab, setActiveTab] = useState<'pillars' | 'persona' | 'projections' | 'ads' | 'spy'>('pillars');
  const [analysis, setAnalysis] = useState<MarketAnalysisData>(() =>
    product ? getProductMarketAnalysis(product) : ({} as MarketAnalysisData)
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setAnalysis(getProductMarketAnalysis(product));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleGenerateAI = async () => {
    if (!product) return;
    setIsGeneratingAI(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produit: product.produit,
          category: product.category,
          probleme: product.cible || product.angle || '',
          vente: product.vente,
          achat: product.sourcing,
          marge: calculateMargin(product),
          poids: product.poids,
          concurrent: product.concurrent,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const aiAnalysis: MarketAnalysisData = {
          ...analysis,
          ...data.analysis,
        };
        setAnalysis(aiAnalysis);
        if (onSaveAnalysis) {
          onSaveAnalysis(product.id, aiAnalysis);
        }
        setAiMessage(`✨ Analyse IA sur-mesure générée avec succès pour "${product.produit}" !`);
        setTimeout(() => setAiMessage(null), 5000);
      } else {
        setAiMessage(`⚠️ ${data.message || 'Impossible de joindre le serveur IA'}`);
      }
    } catch (err: any) {
      setAiMessage(`⚠️ Erreur génération IA : ${err?.message || 'Erreur réseau'}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

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

  const handleObjectionUpdate = (index: number, field: 'objection' | 'responseScript', value: string) => {
    setAnalysis((prev) => {
      const currentList = [...(prev.reviewsAndObjections?.commonObjections || [])];
      if (currentList[index]) {
        currentList[index] = { ...currentList[index], [field]: value };
      }
      return {
        ...prev,
        reviewsAndObjections: {
          ...(prev.reviewsAndObjections || { topPositiveReviews: '', topNegativeComplaints: '', commonObjections: [] }),
          commonObjections: currentList,
        },
      };
    });
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

  const reviewsObj = analysis.reviewsAndObjections || {
    topPositiveReviews: '',
    topNegativeComplaints: '',
    commonObjections: [],
  };

  const shortcuts = analysis.spyShortcuts || {
    facebookAdsUrl: `https://www.facebook.com/ads/library/?q=${encodeURIComponent(product.produit || '')}`,
    tiktokSearchUrl: `https://www.tiktok.com/search?q=${encodeURIComponent(product.produit || '')}`,
    aliexpressReviewsUrl: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.produit || '')}`,
    amazonReviewsUrl: `https://www.amazon.com/s?k=${encodeURIComponent(product.produit || '')}`,
    googleTrendsUrl: `https://trends.google.com/trends/explore?q=${encodeURIComponent(product.produit || '')}`,
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
                Radar 360°, Persona Cible, Projections CA, Benchmarks Pubs & Espionnage Concurrentiel 1-Clic.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-generate-ai-market"
              disabled={isGeneratingAI}
              onClick={handleGenerateAI}
              title="Générer une analyse 100% sur-mesure par IA (NVIDIA LLM)"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyse IA en cours...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-gold-deep" />
                  <span>✨ Générer avec l'IA en Direct</span>
                </>
              )}
            </button>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Toast Banner */}
        {aiMessage && (
          <div className="market-ai-toast-banner">
            <BrainCircuit className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{aiMessage}</span>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="market-modal-tabs-nav">
          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pillars')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Radar & 5 Piliers</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'persona' ? 'active' : ''}`}
            onClick={() => setActiveTab('persona')}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>2. Buyer Persona</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'projections' ? 'active' : ''}`}
            onClick={() => setActiveTab('projections')}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Projections CA</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>4. Benchmarks Pubs</span>
          </button>

          <button
            type="button"
            className={`market-tab-btn highlight-tab ${activeTab === 'spy' ? 'active' : ''}`}
            onClick={() => setActiveTab('spy')}
          >
            <Search className="w-3.5 h-3.5" />
            <span>5. Avis, Objections & Espionnage 1-Clic</span>
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

          {/* TAB 5: AVIS, OBJECTIONS & ESPIONNAGE 1-CLIC */}
          {activeTab === 'spy' && (
            <div className="spy-section-wrapper">
              {/* Smart Ad Spy Engine */}
              {(() => {
                const spy = extractSmartAdSpyQueries(product.produit, product.category);
                return (
                  <div className="smart-adspy-panel">
                    <div className="adspy-panel-header">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gold-deep" />
                        <h3 className="adspy-title">🧠 Espionnage Intelligent Facebook Ads Library & TikTok</h3>
                      </div>
                      <span className="adspy-badge">Recherche par Angle & Douleurs COD</span>
                    </div>

                    <p className="adspy-subtitle">
                      Les e-commerçants en Afrique ne citent pas le nom d'usine chinois dans leurs pubs. Voici les <strong>4 angles d'attaque réels</strong> pour dénicher instantanément toutes les publicités actives de vos concurrents :
                    </p>

                    {/* 4 Multi-Angle Facebook Ads Library Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <a
                        href={spy.fbCodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-amber-500/40 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-200 no-underline shadow-sm"
                        title="Ouvrir Facebook Ads Library avec l'angle Paiement à la Livraison"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider font-mono">💰 Angle COD (Recommandé)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <strong className="text-xs text-amber-300 font-mono break-words">{spy.fbCodQuery}</strong>
                        <span className="text-[11px] text-slate-400 leading-tight">Toutes les pubs africaines avec paiement à la livraison</span>
                      </a>

                      <a
                        href={spy.fbDeliveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-emerald-500/40 bg-slate-900/50 hover:bg-slate-900 hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-200 no-underline shadow-sm"
                        title="Ouvrir Facebook Ads Library avec l'angle Livraison Gratuite"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider font-mono">🚚 Angle Offre & Promo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <strong className="text-xs text-amber-300 font-mono break-words">{spy.fbDeliveryQuery}</strong>
                        <span className="text-[11px] text-slate-400 leading-tight">Pubs avec offres irrésistibles & livraison gratuite</span>
                      </a>

                      <a
                        href={spy.fbBenefitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-indigo-500/40 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-400 hover:-translate-y-0.5 transition-all duration-200 no-underline shadow-sm"
                        title="Ouvrir Facebook Ads Library avec l'angle Douleur & Problème Résolu"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider font-mono">🎯 Angle Douleur & Problème</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <strong className="text-xs text-amber-300 font-mono break-words">{spy.fbBenefitQuery}</strong>
                        <span className="text-[11px] text-slate-400 leading-tight">Pubs axées sur le problème quotidien résolu</span>
                      </a>

                      <a
                        href={spy.fbExactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-600/50 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-400 hover:-translate-y-0.5 transition-all duration-200 no-underline shadow-sm"
                        title="Ouvrir Facebook Ads Library avec le nom exact"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider font-mono">🔍 Angle Nom Produit</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <strong className="text-xs text-amber-300 font-mono break-words">{spy.fbExactQuery}</strong>
                        <span className="text-[11px] text-slate-400 leading-tight">Recherche brute sur le titre exact</span>
                      </a>
                    </div>

                    {/* TikTok & Platform Shortcuts Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <a
                        href={spy.tiktokViralUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-black text-white hover:bg-gray-900 border border-gray-800 transition-colors text-[10px] sm:text-xs font-bold no-underline shadow-sm"
                      >
                        <span className="truncate mr-1">🎵 TikTok Viral</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                      </a>

                      <a
                        href={spy.tiktokDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 border border-rose-800 transition-colors text-[10px] sm:text-xs font-bold no-underline shadow-sm"
                      >
                        <span className="truncate mr-1">🎬 Démo Vidéo</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                      </a>

                      <a
                        href={spy.aliexpressReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 border border-orange-800 transition-colors text-[10px] sm:text-xs font-bold no-underline shadow-sm"
                      >
                        <span className="truncate mr-1">📦 Avis Ali</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                      </a>

                      <a
                        href={spy.googleTrendsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 border border-blue-800 transition-colors text-[10px] sm:text-xs font-bold no-underline shadow-sm"
                      >
                        <span className="truncate mr-1">📈 Trends</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                );
              })()}

              {/* Global Reviews Synthesis */}
              <div className="reviews-synthesis-grid">
                <div className="review-box positive-box">
                  <div className="review-box-header">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <h4>⭐ Ce Que Les Clients Adorent (Points Forts 5 Étoiles)</h4>
                  </div>
                  <textarea
                    className="review-textarea"
                    rows={4}
                    value={reviewsObj.topPositiveReviews}
                    onChange={(e) =>
                      setAnalysis((prev) => ({
                        ...prev,
                        reviewsAndObjections: {
                          ...(prev.reviewsAndObjections || { topPositiveReviews: '', topNegativeComplaints: '', commonObjections: [] }),
                          topPositiveReviews: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div className="review-box negative-box">
                  <div className="review-box-header">
                    <ThumbsDown className="w-4 h-4 text-rose-600" />
                    <h4>⚠️ Plaintes & Défauts Récurrents (Avis 1 Étoile)</h4>
                  </div>
                  <textarea
                    className="review-textarea"
                    rows={4}
                    value={reviewsObj.topNegativeComplaints}
                    onChange={(e) =>
                      setAnalysis((prev) => ({
                        ...prev,
                        reviewsAndObjections: {
                          ...(prev.reviewsAndObjections || { topPositiveReviews: '', topNegativeComplaints: '', commonObjections: [] }),
                          topNegativeComplaints: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* COD Objections & Phone Closing Scripts */}
              <div className="objections-section-card">
                <div className="objections-header">
                  <MessageSquare className="w-4 h-4 text-gold-deep" />
                  <div>
                    <h3 className="persona-title">🛡️ Top Objections Clients COD & Scripts de Réponse Immédiate</h3>
                    <p className="persona-subtitle">
                      Arguments prêts à l'emploi pour vos téléconseillers et messages WhatsApp pour maximiser le taux de livraison.
                    </p>
                  </div>
                </div>

                <div className="objections-list">
                  {reviewsObj.commonObjections.map((item, idx) => (
                    <div key={idx} className="objection-item-card">
                      <div className="objection-q">
                        <span className="obj-tag">Objection #{idx + 1} :</span>
                        <input
                          type="text"
                          className="obj-input"
                          value={item.objection}
                          onChange={(e) => handleObjectionUpdate(idx, 'objection', e.target.value)}
                        />
                      </div>
                      <div className="objection-r">
                        <span className="res-tag">Script Réponse WhatsApp / Appel :</span>
                        <textarea
                          className="res-textarea"
                          rows={2}
                          value={item.responseScript}
                          onChange={(e) => handleObjectionUpdate(idx, 'responseScript', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
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
              {(analysis.targetCountries || []).map((country, idx) => (
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
