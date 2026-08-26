import { getSupabaseClient } from '../lib/supabaseClient';

export function generateShopCode(shopName?: string): string {
  const prefix = (shopName || 'SIFT')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase() || 'SIFT';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export async function getOrCreateShopCode(userId?: string, shopName?: string, userEmail?: string): Promise<string> {
  if (!userId || userId === 'guest') return 'MABO-8820';

  try {
    const res = await fetch(`/api/workspace/shop-code?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(userEmail || '')}&shopName=${encodeURIComponent(shopName || '')}`);
    if (res.ok) {
      const data = await res.json();
      if (data.shopCode) return data.shopCode;
    }
  } catch (err) {
    console.warn('getOrCreateShopCode fetch notice:', err);
  }

  return 'MABO-8820';
}
