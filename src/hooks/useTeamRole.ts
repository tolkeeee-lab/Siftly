'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserRole, ROLE_PERMISSIONS, RolePermission } from '../types/teamRoles';

const ROLE_STORAGE_KEY = 'siftly_active_user_role_v1';

export function useTeamRole() {
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
      if (saved && ROLE_PERMISSIONS[saved]) {
        setRole(saved);
      }
    } catch (e) {
      console.warn('Could not load role', e);
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch (e) {
      console.warn('Could not save role', e);
    }
  }, []);

  const permissions: RolePermission = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;

  return {
    role,
    permissions,
    switchRole,
  };
}
