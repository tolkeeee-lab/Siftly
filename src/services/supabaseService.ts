import { ProductData } from '../types/product';
import { getSupabaseClient } from '../lib/supabaseClient';
import { parseNum } from '../utils/formatters';

export function mapProductToDb(p: ProductData, userId?: string): Record<string, any> {
  const row: Record<string, any> = {
    id: p.id,
    seq: p.seq,
    produit: p.produit || '',
    img_src: p.imgSrc || '',
    creative: p.creative || '',
    alibaba: p.alibaba || '',
    siteweb: p.siteweb || '',
    marche: p.marche || '',
    concurrent: parseNum(p.concurrent),
    sourcing: parseNum(p.sourcing),
    poids: parseNum(p.poids),
    modeimport: p.modeimport || 'bateau',
    tarifbateau: parseNum(p.tarifbateau),
    tarifavion: parseNum(p.tarifavion),
    cac: parseNum(p.cac),
    livraison: parseNum(p.livraison),
    vente: parseNum(p.vente),
    douleur: p.douleur === '' ? null : parseNum(p.douleur),
    nonres: p.nonres === '' ? null : parseNum(p.nonres),
    etendue: p.etendue === '' ? null : parseNum(p.etendue),
    impact: p.impact === '' ? null : parseNum(p.impact),
    waouh: p.waouh === '' ? null : parseNum(p.waouh),
    innovant: p.innovant === '' ? null : parseNum(p.innovant),
    nonsaison: p.nonsaison === '' ? null : parseNum(p.nonsaison),
    habitudes: p.habitudes === '' ? null : parseNum(p.habitudes),
    poidsfacteur: p.poidsfacteur === '' ? null : parseNum(p.poidsfacteur),
    cible: p.cible || '',
    angle: p.angle || '',
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    row.user_id = userId;
  }

  return row;
}

export function mapDbToProduct(row: Record<string, any>): ProductData {
  return {
    id: row.id,
    seq: row.seq || 1,
    produit: row.produit || '',
    imgSrc: row.img_src || '',
    creative: row.creative || '',
    alibaba: row.alibaba || '',
    siteweb: row.siteweb || '',
    marche: row.marche || '',
    concurrent: row.concurrent ?? '',
    sourcing: row.sourcing ?? '',
    poids: row.poids ?? '',
    modeimport: row.modeimport || 'bateau',
    tarifbateau: row.tarifbateau ?? 3500,
    tarifavion: row.tarifavion ?? 9000,
    cac: row.cac ?? '',
    livraison: row.livraison ?? '',
    vente: row.vente ?? '',
    douleur: row.douleur ?? '',
    nonres: row.nonres ?? '',
    etendue: row.etendue ?? '',
    impact: row.impact ?? '',
    waouh: row.waouh ?? '',
    innovant: row.innovant ?? '',
    nonsaison: row.nonsaison ?? '',
    habitudes: row.habitudes ?? '',
    poidsfacteur: row.poidsfacteur ?? '',
    cible: row.cible || '',
    angle: row.angle || '',
  };
}

async function getActiveUserId(): Promise<string | undefined> {
  const client = getSupabaseClient();
  if (!client) return undefined;
  try {
    const { data: { session } } = await client.auth.getSession();
    if (session?.user?.id) return session.user.id;
    const { data: { user } } = await client.auth.getUser();
    return user?.id;
  } catch (e) {
    console.warn('Error getting active user ID', e);
    return undefined;
  }
}

export async function fetchProductsFromSupabase(): Promise<ProductData[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.from('products').select('*').order('seq', { ascending: true });
  if (error) {
    console.warn('Error fetching products from Supabase:', error);
    return null;
  }
  return (data || []).map(mapDbToProduct);
}

export async function saveProductToSupabase(product: ProductData): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  const userId = await getActiveUserId();
  const row = mapProductToDb(product, userId);
  let { error } = await client.from('products').upsert(row, { onConflict: 'id' });
  
  if (error && (error.code === 'PGRST204' || error.message?.includes('user_id'))) {
    delete row.user_id;
    const retry = await client.from('products').upsert(row, { onConflict: 'id' });
    error = retry.error;
  }

  if (error) {
    console.warn('Error upserting product to Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) {
    console.warn('Error deleting product from Supabase:', error);
    return false;
  }
  return true;
}

export async function saveAllProductsToSupabase(products: ProductData[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || products.length === 0) return false;
  const userId = await getActiveUserId();
  const rows = products.map((p) => mapProductToDb(p, userId));
  let { error } = await client.from('products').upsert(rows, { onConflict: 'id' });

  if (error && (error.code === 'PGRST204' || error.message?.includes('user_id'))) {
    const fallbackRows = products.map((p) => mapProductToDb(p, undefined));
    const retry = await client.from('products').upsert(fallbackRows, { onConflict: 'id' });
    error = retry.error;
  }

  if (error) {
    console.warn('Error saving products to Supabase:', error);
    return false;
  }
  return true;
}
