'use client';

import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { UserRole } from '../../types/teamRoles';
import { useTeamRole } from '../../hooks/useTeamRole';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useTeamRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="role-switcher-wrap">
        <div className="role-current-badge">
          <Shield className="w-3.5 h-3.5 text-gold-deep" />
          <span style={{ fontSize: '11.5px', fontFamily: 'IBM Plex Mono', color: 'var(--panel)' }}>
            👑 Propriétaire
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="role-switcher-wrap">
      <div className="role-current-badge">
        <Shield className="w-3.5 h-3.5 text-gold-deep" />
        <select
          className="role-select"
          value={role}
          onChange={(e) => switchRole(e.target.value as UserRole)}
        >
          <option value="admin">👑 Propriétaire (Admin)</option>
          <option value="assistant">🤝 Assistant (Accès Total)</option>
          <option value="media_buyer">🎬 Média Buyer</option>
          <option value="logistics">🚚 Livreur / Logistique</option>
          <option value="inventory">📦 Magasinier (Stock)</option>
        </select>
      </div>
    </div>
  );
};
