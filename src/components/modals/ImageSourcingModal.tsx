'use client';

import React, { useState, ChangeEvent, DragEvent } from 'react';
import {
  X,
  Camera,
  Upload,
  Search,
  ExternalLink,
  Sparkles,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Globe,
  Tag,
  Scale,
  DollarSign,
  Copy,
  Check,
  Lightbulb,
  Cpu,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { ProductData, PRODUCT_CATEGORIES } from '../../types/product';
import { optimizeSourcingQueries } from '../../utils/sourcingKeywords';

interface ImageSourcingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Partial<ProductData>) => ProductData;
  onOpenMarketAnalysis: (product: ProductData) => void;
}

export const ImageSourcingModal: React.FC<ImageSourcingModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onOpenMarketAnalysis,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [productName, setProductName] = useState<string>('Baseus EnerGeek GR11');
  const [category, setCategory] = useState<string>('High-Tech & Gadgets');
  const [sourcingPrice, setSourcingPrice] = useState<number | ''>(22000);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(45000);
  const [weight, setWeight] = useState<number | ''>(0.6);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<'exact' | 'oem' | 'zh'>('exact');

  if (!isOpen) return null;

  const isGenericFilename = (name: string): boolean => {
    const lower = name.toLowerCase();
    return (
      lower.startsWith('img') ||
      lower.startsWith('screenshot') ||
      lower.startsWith('capture') ||
      lower.startsWith('download') ||
      lower.startsWith('photo') ||
      lower.startsWith('image') ||
      lower.startsWith('whatsapp') ||
      /^\d+$/.test(lower.replace(/[-_.]/g, ''))
    );
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageSrc(base64);

      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
      if (!isGenericFilename(cleanName) && cleanName.length > 3) {
        setProductName(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setImageSrc(imageUrlInput.trim());
    }
  };

  const handleCopySearchText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAndAnalyze = () => {
    const finalName = productName.trim() || 'Nouveau Produit Sourcé';
    const newProduct = onAddProduct({
      produit: finalName,
      imgSrc: imageSrc || undefined,
      category: category || 'High-Tech & Gadgets',
      sourcing: sourcingPrice || 22000,
      vente: sellingPrice || 45000,
      poids: weight || 0.6,
      concurrent: 2,
      douleur: 4,
      waouh: 5,
      innovant: 5,
      etendue: 4,
    });

    onClose();
    setTimeout(() => {
      onOpenMarketAnalysis(newProduct);
    }, 100);
  };

  // Compute optimized queries & clean URLs
  const activeKeyword =
    searchTarget === 'exact'
      ? productName
      : searchTarget === 'oem'
      ? `${productName} OEM factory`
      : `${productName} 1688`;

  const queries = optimizeSourcingQueries(productName, imageSrc);

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="image-sourcing-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="image-sourcing-header">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gold" />
            <div>
              <h2 className="image-sourcing-title">📸 Sourcing Précis & Anti-Pollution Publicitaire</h2>
              <p className="image-sourcing-subtitle">
                Filtre automatique des mots-clés pour cibler l'usine exacte sur Alibaba / AliExpress sans pubs concurrentes (Ugreen/Anker).
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content Grid */}
        <div className="image-sourcing-body">
          {/* Left Column: Image Upload & Visual Search */}
          <div className="image-sourcing-left">
            {!imageSrc ? (
              <div
                className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <ImageIcon className="w-10 h-10 text-gold-deep mb-2 opacity-80" />
                <h4 className="dropzone-title">Glissez votre photo ici</h4>
                <p className="dropzone-sub">ou cliquez pour parcourir vos fichiers (JPG, PNG, WebP)</p>
                <label className="btn-browse-file">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choisir une Image</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="image-preview-card">
                <img src={imageSrc} alt="Produit sourcé" className="preview-img" />
                <button
                  type="button"
                  className="btn-remove-preview"
                  onClick={() => setImageSrc('')}
                  title="Supprimer cette image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Changer d'image</span>
                </button>
              </div>
            )}

            {/* Paste Image URL Fallback */}
            <div className="image-url-fallback">
              <label>Ou collez le lien direct d'une image web :</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://.../image.jpg"
                  className="input-url-field"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <button type="button" className="btn-apply-url" onClick={handleApplyUrl}>
                  Charger
                </button>
              </div>
            </div>

            {/* 3 Sourcing Keyword Targeting Modes */}
            <div className="targeting-modes-box">
              <span className="text-[11px] font-bold text-ink-soft uppercase font-mono">
                🎯 Mode de Ciblage Usine :
              </span>
              <div className="flex gap-1.5 mt-1.5">
                <button
                  type="button"
                  className={`target-mode-pill ${searchTarget === 'exact' ? 'active' : ''}`}
                  onClick={() => setSearchTarget('exact')}
                  title="Recherche sur le modèle exact sans mots parasites"
                >
                  🏷️ Modèle Exact
                </button>
                <button
                  type="button"
                  className={`target-mode-pill ${searchTarget === 'oem' ? 'active' : ''}`}
                  onClick={() => setSearchTarget('oem')}
                  title="Recherche des fabricants du moule générique sans la marque"
                >
                  🏭 Usines OEM Génériques
                </button>
                <button
                  type="button"
                  className={`target-mode-pill ${searchTarget === 'zh' ? 'active' : ''}`}
                  onClick={() => setSearchTarget('zh')}
                  title="Recherche en Chinois pour 1688 / Taobao"
                >
                  🇨🇳 1688 Chinois
                </button>
              </div>
            </div>

            {/* 1-Click Reverse Image & Sourcing Search Buttons */}
            <div className="visual-search-shortcuts">
              <div className="flex items-center justify-between">
                <span className="shortcuts-label">
                  🔍 Moteurs filtrés pour : « {searchTarget === 'zh' ? queries.chineseQuery : searchTarget === 'oem' ? queries.factoryOemQuery : queries.exactModelQuery} »
                </span>
                <button
                  type="button"
                  className="text-xs text-gold-deep hover:underline flex items-center gap-1"
                  onClick={() => handleCopySearchText(searchTarget === 'zh' ? queries.chineseQuery : searchTarget === 'oem' ? queries.factoryOemQuery : queries.exactModelQuery)}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <div className="shortcuts-grid">
                <a
                  href={queries.aliexpressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn express-btn"
                  title="Rechercher sur AliExpress avec ciblage exact du modèle"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>AliExpress (Modèle Direct)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={queries.alibabaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn ali-btn"
                  title="Rechercher les fabricants sur Alibaba"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Alibaba (Fournisseurs Gros)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={queries.alibaba1688Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn zh-btn"
                  title="Rechercher directement sur 1688 Chine"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>1688 Chine (Prix Usine)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={queries.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn tt-btn"
                  title="Rechercher les vidéos sur TikTok"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>TikTok (Vidéos Virales)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={queries.googleLensUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn lens-btn col-span-2"
                  title="Rechercher avec Google Lens (Glissez-y votre image)"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Lens (Recherche par Image Visuelle Universelle)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Product Details Setup */}
          <div className="image-sourcing-right">
            <h3 className="setup-title">✨ Détails du Produit & Analyse</h3>

            <div className="setup-fields-list">
              {/* Product Name Input */}
              <div className="setup-field highlight-field">
                <label className="text-gold-deep flex items-center gap-1 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Nom / Mots-clés Précis du Produit :</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Baseus EnerGeek GR11"
                  className="setup-input font-bold text-ink"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="setup-field">
                <label>Catégorie / Niche E-Commerce</label>
                <select
                  className="setup-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setup-row-2">
                <div className="setup-field">
                  <label>Prix Sourcing Brut (FCFA)</label>
                  <input
                    type="number"
                    className="setup-input font-mono"
                    value={sourcingPrice}
                    onChange={(e) => setSourcingPrice(Number(e.target.value) || '')}
                  />
                </div>

                <div className="setup-field">
                  <label>Prix de Vente Cible (FCFA)</label>
                  <input
                    type="number"
                    className="setup-input font-mono text-emerald-700 font-bold"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value) || '')}
                  />
                </div>
              </div>

              <div className="setup-field">
                <label>Poids Estimé (kg) — ⚠️ Sensible pour fret batterie</label>
                <input
                  type="number"
                  step="0.1"
                  className="setup-input font-mono"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || '')}
                />
              </div>

              <div className="sourcing-pro-tip">
                <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
                <p>
                  En validant, la ligne sera créée avec votre photo et le <strong>dossier d'intelligence de marché à 360°</strong> s'ouvrira immédiatement pour estimer votre rentabilité COD !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="image-sourcing-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn-create-and-analyze"
            onClick={handleCreateAndAnalyze}
          >
            <Sparkles className="w-4 h-4" />
            <span>Créer le Produit & Lancer l'Analyse Marché</span>
          </button>
        </div>
      </div>
    </div>
  );
};
