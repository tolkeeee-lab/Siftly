'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';

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
    const client = getSupabaseClient();
    if (!client) {
      alert('Configuration Supabase non disponible.');
      return;
    }

    const redirectUrl = typeof window !== 'undefined'
      ? window.location.origin
      : undefined;

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      alert('Erreur lors de la connexion Google: ' + error.message);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Client Supabase non initialisé');
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, pass: string) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Client Supabase non initialisé');
    const { data, error } = await client.auth.signUp({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
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
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
