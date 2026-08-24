-- SQL Schema for Siftly Product Research Grid in Supabase
-- Paste this script into your Supabase SQL Editor (https://app.supabase.com)

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  seq INT,
  produit TEXT,
  img_src TEXT,
  creative TEXT,
  alibaba TEXT,
  siteweb TEXT,
  marche TEXT,
  concurrent NUMERIC,
  sourcing NUMERIC,
  poids NUMERIC,
  modeimport TEXT DEFAULT 'bateau',
  tarifbateau NUMERIC,
  tarifavion NUMERIC,
  cac NUMERIC,
  livraison NUMERIC,
  vente NUMERIC,
  douleur NUMERIC,
  nonres NUMERIC,
  etendue NUMERIC,
  impact NUMERIC,
  waouh NUMERIC,
  innovant NUMERIC,
  nonsaison NUMERIC,
  habitudes NUMERIC,
  poidsfacteur NUMERIC,
  cible TEXT,
  angle TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) & Allow public read/write access for demonstration
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.products
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.products
  FOR DELETE USING (true);
