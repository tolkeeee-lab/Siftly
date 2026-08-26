'use client';

import React, { useState } from 'react';
import { Lock, Mail, Sparkles, UserCheck, Shield } from 'lucide-react';

interface LoginPageProps {
  onSignInWithGoogle: () => void;
  onSignInWithEmail: (email: string, pass: string) => Promise<any>;
  onSignUpWithEmail: (email: string, pass: string) => Promise<any>;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSignInWithGoogle,
  onSignInWithEmail,
  onSignUpWithEmail,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Veuillez renseigner votre email et mot de passe.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await onSignInWithEmail(email.trim(), password);
      } else {
        await onSignUpWithEmail(email.trim(), password);
        setSuccessMsg('✨ Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur d\'authentification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">Siftly <em>EAA</em></div>
        <p className="auth-subtitle">
          Espace de Travail E-Commerce & Recherche Produits Gagnants
        </p>

        {/* Segmented Auth Mode Switch */}
        <div className="auth-mode-segmented">
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
          >
            🔑 J'ai déjà un compte (Se Connecter)
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
          >
            ✨ Créer un Compte
          </button>
        </div>

        {/* Google 1-Click Button */}
        <button type="button" className="google-btn" onClick={onSignInWithGoogle}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </button>

        <div className="auth-divider">
          <span>ou avec votre email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errorMsg && <div className="auth-error-msg">{errorMsg}</div>}
          {successMsg && <div className="auth-success-msg">{successMsg}</div>}

          <div className="auth-input-group">
            <label className="auth-label">
              <Mail className="w-3.5 h-3.5 inline mr-1 text-gold-deep" />
              Adresse E-mail
            </label>
            <input
              type="email"
              className="auth-input"
              placeholder="votre.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">
              <Lock className="w-3.5 h-3.5 inline mr-1 text-gold-deep" />
              Mot de passe
            </label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting
              ? 'Connexion en cours...'
              : mode === 'login'
              ? 'Se Connecter à mon Espace'
              : 'Créer mon Compte'}
          </button>
        </form>

        <div className="auth-help-box">
          <Shield className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
          <p>
            <strong>Collaborateurs & Équipe :</strong> Connectez-vous simplement avec l'adresse email enregistrée par votre responsable pour accéder directement à la boutique.
          </p>
        </div>
      </div>
    </div>
  );
};
