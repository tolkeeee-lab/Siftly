'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamMember, UserRole } from '../types/teamRoles';
import {
  fetchTeamMembersFromDb,
  saveTeamMemberToDb,
  deleteTeamMemberFromDb,
  checkCollaboratorMembership,
  MembershipInfo,
} from '../services/teamService';
import { useAuth } from './useAuth';

const TEAM_MEMBERS_KEY = 'siftly_team_members_v2';

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membership, setMembership] = useState<MembershipInfo>({ isCollaborator: false });
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load from local storage and Supabase Cloud
  useEffect(() => {
    let localData: TeamMember[] = [];
    try {
      const saved = localStorage.getItem(TEAM_MEMBERS_KEY);
      if (saved) {
        localData = JSON.parse(saved);
        setMembers(localData);
      }
    } catch (e) {
      console.warn('Could not load team members', e);
    }
    setIsLoaded(true);

    // Sync with Supabase
    async function syncCloud() {
      if (user?.email) {
        // Check if active user is a collaborator
        const memberInfo = await checkCollaboratorMembership(user.email);
        setMembership(memberInfo);

        // If owner, fetch registered team
        const dbMembers = await fetchTeamMembersFromDb();
        if (dbMembers.length > 0) {
          setMembers(dbMembers);
          try {
            localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(dbMembers));
          } catch { /* quota */ }
        } else if (localData.length > 0) {
          // Upload local members to Supabase
          for (const m of localData) {
            await saveTeamMemberToDb(m);
          }
        }
      }
    }
    syncCloud();
  }, [user]);

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

    // Async save to Supabase
    saveTeamMemberToDb(newMember);

    return newMember;
  }, [saveMembers]);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveMembers(next);
      return next;
    });

    // Async delete from Supabase
    deleteTeamMemberFromDb(id);
  }, [saveMembers]);

  return {
    members,
    membership,
    addMember,
    removeMember,
    saveMembers,
    isLoaded,
  };
}
