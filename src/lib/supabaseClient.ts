import { createClient, SupabaseClient } from '@supabase/supabase-js';

const LOCAL_CFG_KEY = 'siftly-supabase-config';

const DEFAULT_SUPABASE_URL = 'https://tkbqmthwqxvevlrqrann.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrYnFtdGh3cXh2ZXZscnFyYW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzMwMjMsImV4cCI6MjEwMzE0OTAyM30._fSab7MBOGn0maQFGf86b2oLMhg0s41a-bGh4Y_9D54';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseConfig & { client: SupabaseClient } | null = null;

export function sanitizeSupabaseUrl(url: string): string {
  if (!url) return DEFAULT_SUPABASE_URL;
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/auth\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned || DEFAULT_SUPABASE_URL;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') {
    return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
  }
  try {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
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

export function getSupabaseClient(): SupabaseClient {
  const cfg = getStoredSupabaseConfig();
  const cleanUrl = sanitizeSupabaseUrl(cfg.url);

  if (cachedClient && cachedClient.url === cleanUrl && cachedClient.anonKey === cfg.anonKey) {
    return cachedClient.client;
  }

  const client = createClient(cleanUrl, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  cachedClient = { url: cleanUrl, anonKey: cfg.anonKey, client };
  return client;
}
