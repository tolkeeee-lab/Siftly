'use client';

import React from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { getStoredSupabaseConfig } from '../../lib/supabaseClient';

interface SupabaseStatusBadgeProps {
  isSyncing?: boolean;
}

export const SupabaseStatusBadge: React.FC<SupabaseStatusBadgeProps> = ({ isSyncing }) => {
  const isConnected = !!getStoredSupabaseConfig();

  if (!isConnected) return null;

  return (
    <div
      className="tbtn load"
      style={{
        borderColor: 'var(--sage)',
        color: 'var(--sage)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <Database className="w-3.5 h-3.5" />
      <span>{isSyncing ? 'Sync Supabase...' : 'Supabase Connecté'}</span>
      <CheckCircle2 className="w-3 h-3 text-sage" />
    </div>
  );
};
