import { getSupabaseClient } from '../lib/supabaseClient';

export function generateShopCode(shopName?: string): string {
  const prefix = (shopName || 'SIFT')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase() || 'SIFT';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export async function getOrCreateShopCode(userId: string, shopName?: string): Promise<string> {
  const client = getSupabaseClient();
  if (!client || !userId) return 'SIFT-8820';

  try {
    // Check if shop already exists for this owner
    const { data, error } = await client
      .from('shops')
      .select('shop_code')
      .eq('owner_id', userId)
      .limit(1);

    if (!error && data && data.length > 0 && data[0].shop_code) {
      return data[0].shop_code;
    }

    // Create new shop code
    const newCode = generateShopCode(shopName);
    await client.from('shops').insert({
      owner_id: userId,
      shop_name: shopName || 'Ma Boutique E-Commerce',
      shop_code: newCode,
    });

    return newCode;
  } catch (err) {
    console.warn('getOrCreateShopCode notice:', err);
    return 'SIFT-8820';
  }
}
