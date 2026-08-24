import { createClient, SupabaseClient } from '@supabase/supabase-js';

const LOCAL_CFG_KEY = 'siftly-supabase-config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseConfig & { client: SupabaseClient } | null = null;

export function sanitizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/auth\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (envUrl && envKey) {
      return { url: sanitizeSupabaseUrl(envUrl), anonKey: envKey.trim() };
    }
    const saved = localStorage.getItem(LOCAL_CFG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: sanitizeSupabaseUrl(parsed.url), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch (e) {
    console.warn('Could not read Supabase config', e);
  }
  return null;
}

export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  if (typeof window !== 'undefined') {
    const cleanConfig = {
      url: sanitizeSupabaseUrl(config.url),
      anonKey: config.anonKey.trim(),
    };
    localStorage.setItem(LOCAL_CFG_KEY, JSON.stringify(cleanConfig));
    cachedClient = null;
  }
}

export function clearStoredSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_CFG_KEY);
    cachedClient = null;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getStoredSupabaseConfig();
  if (!cfg?.url || !cfg?.anonKey) return null;

  const cleanUrl = sanitizeSupabaseUrl(cfg.url);

  if (cachedClient && cachedClient.url === cleanUrl && cachedClient.anonKey === cfg.anonKey) {
    return cachedClient.client;
  }

  try {
    const client = createClient(cleanUrl, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    cachedClient = { url: cleanUrl, anonKey: cfg.anonKey, client };
    return client;
  } catch (e) {
    console.warn('Invalid Supabase configuration', e);
    return null;
  }
}
