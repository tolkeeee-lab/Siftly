-- ==========================================================================
-- SIFTLY EAA : SCHÉMA SQL COMPLET POUR SUPABASE (MULTI-TENANT & HYBRIDE)
-- ==========================================================================
-- Copiez et collez ce script dans l'éditeur SQL de votre Dashboard Supabase
-- (https://app.supabase.com -> Projet Siftly -> SQL Editor -> New Query -> Run)
--
-- ✅ TOUTES VOS DONNÉES EXISTANTES SONT 100% CONSERVÉES (IF NOT EXISTS)
-- ✅ SÉCURITÉ RLS ACTIVE POUR PROTÉGER VOS DONNÉES PAR UTILISATEUR

-- 1. TABLE PRODUITS DE RECHERCHE
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

-- 2. TABLE BONS DE COMMANDE SOURCING (PO)
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  po_number TEXT,
  product_id TEXT,
  product_name TEXT,
  supplier_name TEXT,
  supplier_contact TEXT,
  forwarder_name TEXT,
  freight_mode TEXT,
  quantity INT,
  unit_price_yuan NUMERIC,
  unit_price_usd NUMERIC,
  status TEXT DEFAULT 'draft',
  notes TEXT,
  order_date DATE,
  estimated_arrival DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLE COMMANDES CLIENTS COD & LIVRAISONS
CREATE TABLE IF NOT EXISTS public.cod_orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  order_number TEXT,
  product_id TEXT,
  product_name TEXT,
  quantity INT DEFAULT 1,
  total_price_fcfa NUMERIC,
  customer_name TEXT,
  customer_phone TEXT,
  customer_city TEXT,
  customer_address TEXT,
  livreur_id TEXT,
  livreur_name TEXT,
  delivery_fee_fcfa NUMERIC DEFAULT 1500,
  status TEXT DEFAULT 'to_confirm',
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLE LIVREURS ENREGISTRÉS
CREATE TABLE IF NOT EXISTS public.livreurs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name TEXT,
  phone TEXT,
  zone TEXT,
  delivery_fee NUMERIC DEFAULT 1500,
  return_fee NUMERIC DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLE JOURNAL DES DÉPENSES (ADS, CARTONS, CHARGES)
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  date DATE,
  category TEXT,
  description TEXT,
  amount_fcfa NUMERIC,
  product_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLE GESTION DE STOCK & MOUVEMENTS
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  product_id TEXT,
  product_name TEXT,
  date DATE,
  type TEXT,
  quantity_change INT,
  reason TEXT,
  reference_doc TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLE PAGES DE VENTE PERSONNALISÉES (LANDING CONFIGS)
CREATE TABLE IF NOT EXISTS public.landing_configs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  product_id TEXT UNIQUE,
  config_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABLE COLLABORATEURS & ASSISTANTS
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'assistant',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================================
-- ACTIVATION DU ROW LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
-- ==========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livreurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- POLITIQUES D'ISOLATION ET D'ACCÈS
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('products', 'purchase_orders', 'cod_orders', 'livreurs', 'expenses', 'stock_movements', 'landing_configs', 'team_members')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Users can read own %I" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert own %I" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Users can update own %I" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete own %I" ON public.%I', tbl, tbl);

    EXECUTE format('CREATE POLICY "Users can read own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can update own %I" ON public.%I FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Users can delete own %I" ON public.%I FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL)', tbl, tbl);
  END LOOP;
END $$;
