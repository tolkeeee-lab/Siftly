'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginPage } from './LoginPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <span>Chargement de Siftly...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onSignInWithGoogle={signInWithGoogle}
        onSignInWithEmail={signInWithEmail}
        onSignUpWithEmail={signUpWithEmail}
      />
    );
  }

  return <>{children}</>;
};
