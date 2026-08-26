'use client';

import React from 'react';
import { UserMenu } from '../auth/UserMenu';
import { RoleSwitcher } from './RoleSwitcher';
import { useShopProfile } from '../../hooks/useShopProfile';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { Store, ShieldCheck } from 'lucide-react';

export const Masthead: React.FC = () => {
  const { profile } = useShopProfile();
  const { membership } = useTeamMembers();

  return (
    <header className="masthead">
      <div className="flex items-center gap-2.5">
        <h1 className="masthead-title">
          Siftly <em>EAA</em>
        </h1>
        {profile.shopName && profile.shopName !== 'Ma Boutique E-Commerce' && (
          <span className="masthead-shop-badge">
            <Store className="w-3 h-3 text-gold" />
            <span>{profile.shopName}</span>
          </span>
        )}
        {membership.isCollaborator && (
          <span className="masthead-shop-badge" style={{ background: '#064E3B', color: '#6EE7B7', borderColor: '#059669' }}>
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Membre Rattaché ({membership.role})</span>
          </span>
        )}
      </div>
      <div className="masthead-actions">
        <RoleSwitcher />
        <UserMenu />
      </div>
    </header>
  );
};
