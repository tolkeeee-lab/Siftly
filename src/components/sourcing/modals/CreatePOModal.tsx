'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Package, DollarSign, Ship, Building, Tag } from 'lucide-react';
import { PurchaseOrder, CurrencyCode, FreightMode, POStatus } from '../../../types/purchaseOrder';
import { ProductData } from '../../../types/product';
import { formatFCFA } from '../../../utils/formatters';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  onSavePO: (poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => void;
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({
  isOpen,
  onClose,
  products,
  onSavePO,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productName, setProductName] = useState('');
  const [productImg, setProductImg] = useState('');
  
  const [supplierName, setSupplierName] = useState('');
  const [supplierLink, setSupplierLink] = useState('');
  const [supplierContact, setSupplierContact] = useState('');

  const [currency, setCurrency] = useState<CurrencyCode>('FCFA');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(1800);
  const [quantity, setQuantity] = useState<number>(50);

  const [freightMode, setFreightMode] = useState<FreightMode>('bateau');
  const [forwarderName, setForwarderName] = useState('');
  const [shippingMark, setShippingMark] = useState('BJ-COT-001');
  const [forwarderWarehouse, setForwarderWarehouse] = useState('Guangzhou Cargo Hub');
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(15);
  const [freightRateFCFA, setFreightRateFCFA] = useState<number>(3500);

  // Auto-fill when a Siftly product is selected
  useEffect(() => {
    if (selectedProductId) {
      const p = products.find((prod) => prod.id === selectedProductId);
      if (p) {
        setProductName(p.produit || '');
        setProductImg(p.imgSrc || '');
        setSupplierLink(p.alibaba || '');
        setUnitPrice(p.sourcing || 1800);
        const w = parseFloat(String(p.poids)) || 0.3;
        setEstimatedWeightKg(Math.round(w * quantity * 10) / 10);
        if (p.modeimport === 'avion') {
          setFreightMode('avion');
          setFreightRateFCFA(9000);
        } else {
          setFreightMode('bateau');
          setFreightRateFCFA(3500);
        }
      }
    }
  }, [selectedProductId, products, quantity]);

  // Adjust freight rate when mode changes
  const handleFreightModeChange = (mode: FreightMode) => {
    setFreightMode(mode);
    setFreightRateFCFA(mode === 'avion' ? 9000 : 3500);
  };

  // Adjust exchange rate when currency changes
  const handleCurrencyChange = (curr: CurrencyCode) => {
    setCurrency(curr);
    if (curr === 'RMB') setExchangeRate(88);
    else if (curr === 'USD') setExchangeRate(615);
    else setExchangeRate(1);
  };

  if (!isOpen) return null;

  const totalMerchandiseOriginal = quantity * unitPrice;
  const totalMerchandiseFCFA = currency === 'FCFA' ? totalMerchandiseOriginal : totalMerchandiseOriginal * exchangeRate;
  const totalFreightFCFA = estimatedWeightKg * freightRateFCFA;
  const totalLandedFCFA = totalMerchandiseFCFA + totalFreightFCFA;
  const landedPerUnit = quantity > 0 ? Math.round(totalLandedFCFA / quantity) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    onSavePO({
      productId: selectedProductId || undefined,
      productName: productName.trim(),
      productImg,
      supplierName: supplierName.trim() || 'Fournisseur 1688',
      supplierLink: supplierLink.trim(),
      supplierContact: supplierContact.trim(),
      currency,
      exchangeRateToFCFA: exchangeRate,
      unitPriceOriginal: unitPrice,
      quantity,
      variants: [],
      freightMode,
      forwarderName: forwarderName.trim() || 'Transitaire Maritime',
      forwarderWarehouse: forwarderWarehouse.trim(),
      shippingMark: shippingMark.trim(),
      estimatedWeightKg,
      freightRatePerKgFCFA: freightRateFCFA,
      status: 'negotiating' as POStatus,
    });

    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box po-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="po-modal-header">
          <div className="po-modal-title">
            <Package className="w-5 h-5 text-gold-deep" />
            <h2>Nouveau Bon de Commande Fournisseur (PO)</h2>
          </div>
          <button type="button" className="rowdel" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="po-modal-form">
          {/* Section 1: Produit de base */}
          <div className="po-form-section">
            <label className="po-form-label">Importer depuis vos produits Siftly :</label>
            <select
              className="po-select-input"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Choisir un produit gagnant Siftly (Optionnel) --</option>
              {products.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  #{idx + 1} - {p.produit || 'Produit sans nom'} ({p.marche || 'Chine'})
                </option>
              ))}
            </select>
          </div>

          <div className="po-form-row">
            <div className="po-form-group flex-2">
              <label className="po-form-label">Nom officiel du produit *</label>
              <input
                className="po-text-input"
                type="text"
                required
                placeholder="ex: Lampe Anti-Moustique Photocatalytique"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="po-form-group flex-1">
              <label className="po-form-label">Fournisseur</label>
              <input
                className="po-text-input"
                type="text"
                placeholder="ex: Usine Shenzhen Tech"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Devises & Quantités */}
          <div className="po-form-card gold">
            <div className="po-card-subhead">
              <DollarSign className="w-4 h-4 text-gold-deep" />
              <span>Quantité & Prix d'achat Usine</span>
            </div>

            <div className="po-form-row">
              <div className="po-form-group">
                <label className="po-form-label">Devise usine</label>
                <select
                  className="po-select-input"
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                >
                  <option value="FCFA">Franc CFA (FCFA) - Par Défaut</option>
                  <option value="RMB">Yuan Chinois (¥ RMB)</option>
                  <option value="USD">Dollar Américain ($ USD)</option>
                </select>
              </div>

              <div className="po-form-group">
                <label className="po-form-label">Taux en FCFA</label>
                <input
                  className="po-text-input"
                  type="number"
                  step="0.1"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
                />
              </div>

              <div className="po-form-group">
                <label className="po-form-label">Prix usine ({currency})</label>
                <input
                  className="po-text-input bold"
                  type="number"
                  step="0.01"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="po-form-group">
                <label className="po-form-label">Quantité (pcs)</label>
                <input
                  className="po-text-input bold"
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="po-calc-summary">
              <span>Total Marchandise : <strong>{currency} {totalMerchandiseOriginal.toLocaleString()}</strong></span>
              <span>Soit : <strong className="text-gold-deep">{formatFCFA(totalMerchandiseFCFA)}</strong></span>
            </div>
          </div>

          {/* Section 3: Logistique & Transitaire */}
          <div className="po-form-card sky">
            <div className="po-card-subhead">
              <Ship className="w-4 h-4 text-sky-400" />
              <span>Transitaire & Expédition Chine $\to$ Afrique</span>
            </div>

            <div className="po-form-row">
              <div className="po-form-group">
                <label className="po-form-label">Mode d'importation</label>
                <div className="po-mode-toggle-btns">
                  <button
                    type="button"
                    className={`po-mode-btn ${freightMode === 'bateau' ? 'active' : ''}`}
                    onClick={() => handleFreightModeChange('bateau')}
                  >
                    🚢 Bateau (3 500 F/kg)
                  </button>
                  <button
                    type="button"
                    className={`po-mode-btn ${freightMode === 'avion' ? 'active' : ''}`}
                    onClick={() => handleFreightModeChange('avion')}
                  >
                    ✈️ Avion (9 000 F/kg)
                  </button>
                </div>
              </div>

              <div className="po-form-group">
                <label className="po-form-label">Nom Transitaire</label>
                <input
                  className="po-text-input"
                  type="text"
                  placeholder="ex: Speedaf / Fret Maritime"
                  value={forwarderName}
                  onChange={(e) => setForwarderName(e.target.value)}
                />
              </div>

              <div className="po-form-group">
                <label className="po-form-label">Shipping Mark (Code Carton)</label>
                <input
                  className="po-text-input bold"
                  type="text"
                  placeholder="ex: BJ-COT-042"
                  value={shippingMark}
                  onChange={(e) => setShippingMark(e.target.value)}
                />
              </div>
            </div>

            <div className="po-form-row">
              <div className="po-form-group">
                <label className="po-form-label">Poids total estimé (kg)</label>
                <input
                  className="po-text-input"
                  type="number"
                  step="0.1"
                  value={estimatedWeightKg}
                  onChange={(e) => setEstimatedWeightKg(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="po-form-group flex-2">
                <label className="po-form-label">Adresse entrepôt Chine (Transitaire)</label>
                <input
                  className="po-text-input"
                  type="text"
                  placeholder="ex: Guangzhou Baiyun District Warehouse #4"
                  value={forwarderWarehouse}
                  onChange={(e) => setForwarderWarehouse(e.target.value)}
                />
              </div>
            </div>

            <div className="po-calc-summary sky">
              <span>Fret estimé : <strong>{formatFCFA(totalFreightFCFA)}</strong></span>
              <span>Coût Total Rendu : <strong className="text-emerald-400">{formatFCFA(totalLandedFCFA)} (~{formatFCFA(landedPerUnit)}/pc)</strong></span>
            </div>
          </div>

          <div className="po-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-save-po">
              <Plus className="w-4 h-4" />
              <span>Générer le Bon de Commande (PO)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
