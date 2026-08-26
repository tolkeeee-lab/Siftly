'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamMember, UserRole } from '../types/teamRoles';

const TEAM_MEMBERS_KEY = 'siftly_team_members_v1';

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Propriétaire (Vous)',
    email: 'admin@siftly.app',
    phone: '+229 97 00 00 00',
    role: 'admin',
    addedDate: '2026-08-01',
    isActive: true,
  },
  {
    id: 'member-2',
    name: 'Assistant de Direction',
    email: 'assistant@siftly.app',
    phone: '+229 96 11 22 33',
    role: 'assistant',
    addedDate: '2026-08-15',
    isActive: true,
  },
];

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEAM_MEMBERS_KEY);
      if (saved) {
        setMembers(JSON.parse(saved));
      } else {
        setMembers(DEFAULT_TEAM_MEMBERS);
        localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(DEFAULT_TEAM_MEMBERS));
      }
    } catch (e) {
      console.warn('Could not load team members', e);
      setMembers(DEFAULT_TEAM_MEMBERS);
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
      id: crypto.randomUUID(),
      addedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    saveMembers([...members, newMember]);
  }, [members, saveMembers]);

  const removeMember = useCallback((id: string) => {
    saveMembers(members.filter((m) => m.id !== id));
  }, [members, saveMembers]);

  const toggleMemberActive = useCallback((id: string) => {
    saveMembers(
      members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  }, [members, saveMembers]);

  return {
    members,
    isLoaded,
    addMember,
    removeMember,
    toggleMemberActive,
  };
}
