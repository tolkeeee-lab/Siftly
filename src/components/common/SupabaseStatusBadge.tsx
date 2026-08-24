'use client';

import React from 'react';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { getStoredSupabaseConfig } from '../../lib/supabaseClient';

interface SupabaseStatusBadgeProps {
  onOpenConfig: () => void;
  isSyncing?: boolean;
}

export const SupabaseStatusBadge: React.FC<SupabaseStatusBadgeProps> = ({ onOpenConfig, isSyncing }) => {
  const isConnected = !!getStoredSupabaseConfig();

  return (
    <button
      type="button"
      className="tbtn load"
      onClick={onOpenConfig}
      title={isConnected ? 'Supabase est connecté et synchronisé' : 'Cliquer pour configurer Supabase'}
      style={{
        borderColor: isConnected ? 'var(--sage)' : 'rgba(247,242,228,0.3)',
        color: isConnected ? 'var(--sage)' : 'var(--panel)',
      }}
    >
      <Database className="w-3.5 h-3.5" />
      {isConnected ? (
        <>
          <span>{isSyncing ? 'Sync Supabase...' : 'Supabase Connecté'}</span>
          <CheckCircle2 className="w-3 h-3 text-sage" />
        </>
      ) : (
        <span>Connecter Supabase</span>
      )}
    </button>
  );
};
