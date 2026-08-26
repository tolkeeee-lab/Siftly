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
} from 'lucide-react';
import { ProductData, PRODUCT_CATEGORIES } from '../../types/product';
import { getProductMarketAnalysis } from '../../utils/marketIntelligence';

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
  const [productName, setProductName] = useState<string>('');
  const [category, setCategory] = useState<string>('Maison & Confort');
  const [sourcingPrice, setSourcingPrice] = useState<number | ''>(3500);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(15000);
  const [weight, setWeight] = useState<number | ''>(0.4);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageSrc(base64);
      if (!productName) {
        // Guess a default name from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
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

  const handleCreateAndAnalyze = () => {
    const finalName = productName.trim() || 'Nouveau Produit Sourcé';
    const newProduct = onAddProduct({
      produit: finalName,
      imgSrc: imageSrc || undefined,
      category: category || 'Maison & Confort',
      sourcing: sourcingPrice || 3500,
      vente: sellingPrice || 15000,
      poids: weight || 0.4,
      concurrent: 2,
      douleur: 4,
      waouh: 4,
      innovant: 4,
      etendue: 4,
    });

    onClose();
    // Open market analysis immediately for this newly created product
    setTimeout(() => {
      onOpenMarketAnalysis(newProduct);
    }, 100);
  };

  const querySearch = encodeURIComponent(productName || 'produit e-commerce');
  const googleLensUrl = imageSrc && imageSrc.startsWith('http')
    ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageSrc)}`
    : `https://www.google.com/search?tbm=isch&q=${querySearch}`;

  const alibabaVisualUrl = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${querySearch}`;
  const aliexpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${querySearch}`;
  const tiktokUrl = `https://www.tiktok.com/search?q=${querySearch}`;

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="image-sourcing-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="image-sourcing-header">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gold" />
            <div>
              <h2 className="image-sourcing-title">📸 Sourcer par Image & Intelligence Visuelle</h2>
              <p className="image-sourcing-subtitle">
                Importez la photo d'un produit pour trouver les usines, les vidéos publicitaires et lancer l'analyse de marché en 1 clic.
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content Grid */}
        <div className="image-sourcing-body">
          {/* Left Column: Image Upload & Dropzone */}
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
                <p className="dropzone-sub">ou cliquez pour parcourir vos fichiers</p>
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

            {/* 1-Click Reverse Image & Sourcing Search Buttons */}
            <div className="visual-search-shortcuts">
              <span className="shortcuts-label">🔍 Rechercher ce produit sur le web :</span>
              <div className="shortcuts-grid">
                <a
                  href={googleLensUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn lens-btn"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Lens (Recherche Visuelle)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={alibabaVisualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn ali-btn"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Alibaba / 1688 (Usines Chine)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={aliexpressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn express-btn"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>AliExpress (Prix & Avis)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-search-btn tt-btn"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>TikTok (Vidéos Virales)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Product Details Setup */}
          <div className="image-sourcing-right">
            <h3 className="setup-title">✨ Fiche Express & Création Produit</h3>

            <div className="setup-fields-list">
              <div className="setup-field">
                <label>Nom du Produit Détecté</label>
                <input
                  type="text"
                  placeholder="Ex : Hachoir Électrique Multifonction Sans Fil"
                  className="setup-input font-bold"
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
                <label>Poids Estimé (kg) — Impact sur fret & moto</label>
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
