import { TeamMember, UserRole } from '../types/teamRoles';
import { getSupabaseClient } from '../lib/supabaseClient';

export interface MembershipInfo {
  isCollaborator: boolean;
  ownerId?: string;
  shopName?: string;
  role?: UserRole;
  memberName?: string;
}

export async function fetchTeamMembersFromDb(): Promise<TeamMember[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return [];

    const { data, error } = await client
      .from('team_members')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching team members from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name || 'Collaborateur',
      email: row.email || '',
      phone: row.phone || '',
      role: (row.role || 'assistant') as UserRole,
      addedDate: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      isActive: row.is_active ?? true,
    }));
  } catch (err) {
    console.warn('Team fetch crash:', err);
    return [];
  }
}

export async function saveTeamMemberToDb(member: TeamMember, shopName?: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { data: { user } } = await client.auth.getUser();
    const row: Record<string, any> = {
      id: member.id,
      name: member.name,
      email: member.email.toLowerCase().trim(),
      phone: member.phone,
      role: member.role,
      is_active: member.isActive,
    };

    if (user) {
      row.user_id = user.id;
    }

    const { error } = await client.from('team_members').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Error saving team member to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Save member exception:', err);
    return false;
  }
}

export async function deleteTeamMemberFromDb(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('team_members').delete().eq('id', id);
    if (error) {
      console.warn('Error deleting team member from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Delete member exception:', err);
    return false;
  }
}

/**
 * Check if the active logged-in user is a collaborator attached to a founder/owner's shop
 */
export async function checkCollaboratorMembership(userEmail?: string): Promise<MembershipInfo> {
  if (!userEmail) return { isCollaborator: false };

  try {
    const cleanEmail = userEmail.toLowerCase().trim();
    const res = await fetch(`/api/workspace?email=${encodeURIComponent(cleanEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.isCollaborator) {
        return {
          isCollaborator: true,
          ownerId: data.ownerId,
          role: data.role as UserRole,
          memberName: data.memberName,
        };
      }
    }
  } catch (err) {
    console.warn('API check collaborator membership error:', err);
  }

  // Fallback to client Supabase if offline / direct
  const client = getSupabaseClient();
  if (!client) return { isCollaborator: false };

  try {
    const cleanEmail = userEmail.toLowerCase().trim();
    const { data, error } = await client
      .from('team_members')
      .select('*')
      .ilike('email', cleanEmail)
      .eq('is_active', true)
      .limit(1);

    if (error || !data || data.length === 0) {
      return { isCollaborator: false };
    }

    const match = data[0];
    return {
      isCollaborator: true,
      ownerId: match.user_id,
      role: (match.role || 'assistant') as UserRole,
      memberName: match.name || 'Collaborateur',
    };
  } catch (err) {
    console.warn('Check collaborator membership fallback error:', err);
    return { isCollaborator: false };
  }
}
