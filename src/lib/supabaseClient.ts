import { createClient, SupabaseClient } from '@supabase/supabase-js';

const LOCAL_CFG_KEY = 'siftly-supabase-config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (envUrl && envKey) {
      return { url: envUrl, anonKey: envKey };
    }
    const saved = localStorage.getItem(LOCAL_CFG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch (e) {
    console.warn('Could not read Supabase config', e);
  }
  return null;
}

export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CFG_KEY, JSON.stringify(config));
  }
}

export function clearStoredSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_CFG_KEY);
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getStoredSupabaseConfig();
  if (!cfg?.url || !cfg?.anonKey) return null;
  try {
    return createClient(cfg.url, cfg.anonKey);
  } catch (e) {
    console.warn('Invalid Supabase configuration', e);
    return null;
  }
}
