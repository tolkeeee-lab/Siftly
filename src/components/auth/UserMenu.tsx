'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email || 'Utilisateur';

  return (
    <div className="user-menu">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={email}
          className="user-avatar"
        />
      )}
      <span className="user-email" title={email}>
        {email.length > 20 ? email.substring(0, 17) + '...' : email}
      </span>
      <button
        type="button"
        className="logout-btn"
        onClick={signOut}
        title="Se déconnecter"
      >
        Déconnexion
      </button>
    </div>
  );
};
