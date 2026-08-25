'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowRight, Check, Settings2 } from 'lucide-react';
import {
  ExchangeRates,
  getStoredExchangeRates,
  saveStoredExchangeRates,
  convertToFCFA,
} from '../../utils/currencyConverter';
import { formatFCFA } from '../../utils/formatters';

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConvertedPrice?: (fcfaAmount: number) => void;
  initialCurrency?: 'RMB' | 'USD' | 'EUR';
}

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  isOpen,
  onClose,
  onApplyConvertedPrice,
  initialCurrency = 'RMB',
}) => {
  const [rates, setRates] = useState<ExchangeRates>(() => getStoredExchangeRates());
  const [currency, setCurrency] = useState<'RMB' | 'USD' | 'EUR'>(initialCurrency);
  const [foreignAmount, setForeignAmount] = useState<string>('');
  const [isEditingRates, setIsEditingRates] = useState<boolean>(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(foreignAmount) || 0;
  const convertedFCFA = convertToFCFA(numAmount, currency, rates);

  const handleSaveRate = (cur: keyof ExchangeRates, val: string) => {
    const parsed = parseFloat(val) || 1;
    const next = { ...rates, [cur]: parsed };
    setRates(next);
    saveStoredExchangeRates(next);
  };

  const handleApply = () => {
    if (convertedFCFA > 0 && onApplyConvertedPrice) {
      onApplyConvertedPrice(convertedFCFA);
    }
    onClose();
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="w-5 h-5 text-gold-deep" />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Convertisseur de Devises</h3>
          </div>
          <button
            type="button"
            className="rowdel"
            title="Modifier les taux de change"
            onClick={() => setIsEditingRates((prev) => !prev)}
          >
            <Settings2 className="w-4 h-4 text-ink-soft" />
          </button>
        </div>

        {/* Currency Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <button
            type="button"
            className={`preset-view-btn ${currency === 'RMB' ? 'active' : ''}`}
            onClick={() => setCurrency('RMB')}
          >
            🇨🇳 Yuan (RMB ¥)
          </button>
          <button
            type="button"
            className={`preset-view-btn ${currency === 'USD' ? 'active' : ''}`}
            onClick={() => setCurrency('USD')}
          >
            🇺🇸 Dollar (USD $)
          </button>
          <button
            type="button"
            className={`preset-view-btn ${currency === 'EUR' ? 'active' : ''}`}
            onClick={() => setCurrency('EUR')}
          >
            🇪🇺 Euro (EUR €)
          </button>
        </div>

        {/* Rate settings panel if toggled */}
        {isEditingRates && (
          <div style={{ background: 'var(--gold-wash)', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold-deep)', marginBottom: '6px' }}>
              Taux de change personnalisés (1 Devise = X FCFA) :
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '10px' }}>1 RMB ¥</label>
                <input
                  type="number"
                  className="cell-in num"
                  style={{ background: '#fff', padding: '4px', fontSize: '11px', border: '1px solid var(--panel-line)' }}
                  value={rates.RMB}
                  onChange={(e) => handleSaveRate('RMB', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px' }}>1 USD $</label>
                <input
                  type="number"
                  className="cell-in num"
                  style={{ background: '#fff', padding: '4px', fontSize: '11px', border: '1px solid var(--panel-line)' }}
                  value={rates.USD}
                  onChange={(e) => handleSaveRate('USD', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px' }}>1 EUR €</label>
                <input
                  type="number"
                  className="cell-in num"
                  style={{ background: '#fff', padding: '4px', fontSize: '11px', border: '1px solid var(--panel-line)' }}
                  value={rates.EUR}
                  onChange={(e) => handleSaveRate('EUR', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sourcing Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
            Prix sourcing en {currency === 'RMB' ? 'Yuan (¥ 1688/Taobao)' : currency === 'USD' ? 'Dollar ($ Alibaba)' : 'Euro (€)'} :
          </label>
          <input
            className="cell-in"
            style={{
              border: '1.5px solid var(--gold)',
              background: '#fff',
              padding: '10px 12px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
            type="number"
            step="0.01"
            placeholder={currency === 'RMB' ? 'ex: 28.5 ¥' : 'ex: 4.5 $'}
            autoFocus
            value={foreignAmount}
            onChange={(e) => setForeignAmount(e.target.value)}
          />
        </div>

        {/* Converted Result Box */}
        <div
          style={{
            background: 'var(--sage-wash)',
            border: '1px solid var(--sage)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
              Équivalent FCFA (taux: {rates[currency]} F) :
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--sage)', fontFamily: 'monospace' }}>
              {formatFCFA(convertedFCFA)}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-sage" />
        </div>

        <div className="paste-actions" style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="paste-cancel" onClick={onClose}>
            Annuler
          </button>
          {onApplyConvertedPrice && (
            <button
              type="button"
              className="paste-confirm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleApply}
              disabled={convertedFCFA <= 0}
            >
              <Check className="w-4 h-4" />
              Appliquer au Sourcing ({formatFCFA(convertedFCFA)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
