'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { TeamSettingsModal } from '../settings/TeamSettingsModal';

export const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const { membership } = useTeamMembers();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" className="btn-header-settings" style={{ opacity: 0 }}>
        <Settings className="w-3.5 h-3.5" />
        <span>Paramètres</span>
      </button>
    );
  }

  return (
    <>
      <div className="user-menu-wrap">
        {!membership.isCollaborator && (
          <button
            type="button"
            className="btn-header-settings"
            onClick={() => setIsSettingsOpen(true)}
            title="Paramètres, Équipe & Livreurs"
          >
            <Settings className="w-3.5 h-3.5 text-gold" />
            <span className="settings-label">Paramètres</span>
          </button>
        )}
      </div>

      {!membership.isCollaborator && (
        <TeamSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};
