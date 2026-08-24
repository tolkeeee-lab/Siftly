'use client';

import React, { useState, useEffect } from 'react';
import { Database, Check, AlertCircle, Copy } from 'lucide-react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, clearStoredSupabaseConfig } from '../../lib/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredSupabaseConfig();
      setUrl(cfg?.url || '');
      setAnonKey(cfg?.anonKey || '');
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url.trim() || !anonKey.trim()) {
      setStatusMsg('Veuillez renseigner l\'URL et la clé anonyme (Anon Key).');
      return;
    }
    saveStoredSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
    setStatusMsg('Configuration enregistrée avec succès !');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 600);
  };

  const handleDisconnect = () => {
    clearStoredSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setStatusMsg('Supabase déconnecté.');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 600);
  };

  const copySqlSchema = () => {
    const sql = `CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY, seq INT, produit TEXT, img_src TEXT, creative TEXT, alibaba TEXT, siteweb TEXT, marche TEXT, concurrent NUMERIC, sourcing NUMERIC, poids NUMERIC, modeimport TEXT DEFAULT 'bateau', tarifbateau NUMERIC, tarifavion NUMERIC, cac NUMERIC, livraison NUMERIC, vente NUMERIC, douleur NUMERIC, nonres NUMERIC, etendue NUMERIC, impact NUMERIC, waouh NUMERIC, innovant NUMERIC, nonsaison NUMERIC, habitudes NUMERIC, poidsfacteur NUMERIC, cible TEXT, angle TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all" ON public.products FOR ALL USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="paste-modal open" onClick={onClose}>
      <div className="paste-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Database className="w-5 h-5 text-gold-deep" />
          <h2 style={{ margin: 0 }}>Configuration Supabase</h2>
        </div>
        <p>
          Connectez votre projet <strong>Supabase</strong> pour stocker vos fiches produits directement en base de données.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500 }}>Project URL (ex: https://xyz.supabase.co)</label>
            <input
              className="cell-in"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '8px' }}
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500 }}>Anon / Public Key</label>
            <input
              className="cell-in"
              style={{ border: '1px solid var(--panel-line)', background: '#fff', padding: '8px' }}
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
            />
          </div>
        </div>

        {statusMsg && (
          <div style={{ fontSize: '12px', color: 'var(--gold-deep)', marginBottom: '10px' }}>
            {statusMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <button type="button" className="tbtn load" onClick={copySqlSchema} style={{ padding: '6px 12px' }}>
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'SQL Copié !' : 'Copier le script SQL'}
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {getStoredSupabaseConfig() && (
              <button type="button" className="paste-cancel" onClick={handleDisconnect}>
                Déconnecter
              </button>
            )}
            <button type="button" className="paste-confirm" onClick={handleSave}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
