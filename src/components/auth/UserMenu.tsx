'use client';

import React, { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TeamSettingsModal } from '../settings/TeamSettingsModal';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email || 'Utilisateur';

  return (
    <>
      <div className="user-menu">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={email}
            className="user-avatar"
            onClick={() => setIsSettingsOpen(true)}
            style={{ cursor: 'pointer' }}
            title="Ouvrir les Paramètres & Gestion d'Équipe"
          />
        )}
        <span className="user-email" title={email} onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
          {email.length > 18 ? email.substring(0, 15) + '...' : email}
        </span>
        <button
          type="button"
          className="logout-btn"
          onClick={() => setIsSettingsOpen(true)}
          title="Paramètres & Équipe"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Paramètres</span>
        </button>
      </div>

      <TeamSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
