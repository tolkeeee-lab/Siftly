export interface ExchangeRates {
  RMB: number; // Yuan Renminbi -> FCFA
  USD: number; // Dollar US -> FCFA
  EUR: number; // Euro -> FCFA
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  RMB: 85,
  USD: 610,
  EUR: 656,
};

const RATES_STORAGE_KEY = 'siftly-exchange-rates';

export function getStoredExchangeRates(): ExchangeRates {
  if (typeof window === 'undefined') return DEFAULT_EXCHANGE_RATES;
  try {
    const saved = localStorage.getItem(RATES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        RMB: parseFloat(parsed.RMB) || DEFAULT_EXCHANGE_RATES.RMB,
        USD: parseFloat(parsed.USD) || DEFAULT_EXCHANGE_RATES.USD,
        EUR: parseFloat(parsed.EUR) || DEFAULT_EXCHANGE_RATES.EUR,
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_EXCHANGE_RATES;
}

export function saveStoredExchangeRates(rates: ExchangeRates): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
  } catch {
    // ignore
  }
}

export function convertToFCFA(amount: number, currency: 'RMB' | 'USD' | 'EUR', rates = getStoredExchangeRates()): number {
  if (isNaN(amount) || amount <= 0) return 0;
  const rate = rates[currency] || 1;
  return Math.round(amount * rate);
}
