import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tkbqmthwqxvevlrqrann.supabase.co';
  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/\r?\n|\r/g, '');
  return createClient(cleanUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/workspace?email=user@gmail.com
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ isCollaborator: false });
    }

    const cleanEmail = email.toLowerCase().trim();
    const supabase = getAdminSupabase();

    // 1. Check if this email is in team_members table
    const { data: members, error: memErr } = await supabase
      .from('team_members')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (memErr) {
      console.warn('API team_members lookup error:', memErr);
    }

    if (members && members.length > 0) {
      const match = members[0];
      return NextResponse.json({
        isCollaborator: true,
        ownerId: match.user_id || 'main',
        role: match.role || 'assistant',
        memberName: match.name || 'Collaborateur',
      });
    }

    // 2. Check in auth.users for invited collaborator metadata
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authMatch = authUsers?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);
      if (authMatch && (authMatch.user_metadata?.role || authMatch.invited_at)) {
        return NextResponse.json({
          isCollaborator: true,
          ownerId: 'main',
          role: authMatch.user_metadata?.role || 'assistant',
          memberName: authMatch.user_metadata?.full_name || 'Collaborateur',
        });
      }
    } catch (e) {
      console.warn('Admin user check fallback error:', e);
    }

    return NextResponse.json({ isCollaborator: false });
  } catch (err: any) {
    console.error('Workspace lookup exception:', err);
    return NextResponse.json({ isCollaborator: false, error: err.message }, { status: 500 });
  }
}
