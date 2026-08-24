-- SQL Schema for Siftly Product Research Grid in Supabase (Multi-tenant with Google Auth)
-- Paste this script into your Supabase SQL Editor (https://app.supabase.com)

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
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

-- Add user_id column if table already exists without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop old public policies if present
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
DROP POLICY IF EXISTS "Allow public update access" ON public.products;
DROP POLICY IF EXISTS "Allow public delete access" ON public.products;
DROP POLICY IF EXISTS "Users can read own products or unassigned" ON public.products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;

-- Create user-isolated RLS Policies
CREATE POLICY "Users can read own products or unassigned" ON public.products
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);
