'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamMember, UserRole } from '../types/teamRoles';

const TEAM_MEMBERS_KEY = 'siftly_team_members_v2';

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEAM_MEMBERS_KEY);
      if (saved) {
        setMembers(JSON.parse(saved));
      } else {
        setMembers([]);
      }
    } catch (e) {
      console.warn('Could not load team members', e);
      setMembers([]);
    }
    setIsLoaded(true);
  }, []);

  const saveMembers = useCallback((newMembers: TeamMember[]) => {
    setMembers(newMembers);
    try {
      localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(newMembers));
    } catch (e) {
      console.warn('Could not save team members', e);
    }
  }, []);

  const addMember = useCallback((data: { name: string; email: string; phone: string; role: UserRole }) => {
    const newMember: TeamMember = {
      ...data,
      id: 'member-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      addedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setMembers((prev) => {
      const next = [...prev, newMember];
      saveMembers(next);
      return next;
    });
    return newMember;
  }, [saveMembers]);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveMembers(next);
      return next;
    });
  }, [saveMembers]);

  return {
    members,
    addMember,
    removeMember,
    saveMembers,
    isLoaded,
  };
}
