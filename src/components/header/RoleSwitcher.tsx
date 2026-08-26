'use client';

import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '../../types/teamRoles';
import { useTeamRole } from '../../hooks/useTeamRole';

export const RoleSwitcher: React.FC = () => {
  const { role, permissions, switchRole } = useTeamRole();

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
          <option value="media_buyer">🎬 Média Buyer</option>
          <option value="logistics">🚚 Livreur / Logistique</option>
          <option value="inventory">📦 Magasinier (Stock)</option>
        </select>
      </div>
    </div>
  );
};
