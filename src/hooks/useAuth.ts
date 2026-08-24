'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, getStoredSupabaseConfig } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const cfg = getStoredSupabaseConfig();
    const client = getSupabaseClient();
    if (!client || !cfg?.anonKey) {
      alert('Veuillez renseigner votre clé Supabase (Anon Key) avant de vous connecter.');
      return;
    }

    const redirectUrl = typeof window !== 'undefined'
      ? window.location.origin
      : undefined;

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          apikey: cfg.anonKey,
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      alert('Erreur lors de la connexion Google: ' + error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  }, []);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };
}
