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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, action } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Adresse email manquante.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role || 'assistant';
    const supabase = getAdminSupabase();

    if (action === 'approve') {
      // Update team_members and employees
      await supabase
        .from('team_members')
        .update({ is_active: true, role: cleanRole })
        .ilike('email', cleanEmail);

      await supabase
        .from('employees')
        .update({ is_active: true, status: 'approved', role: cleanRole })
        .ilike('email', cleanEmail);

      return NextResponse.json({
        success: true,
        message: `✅ Accès validé ! L'employé "${cleanEmail}" a désormais le rôle "${cleanRole}" et peut se connecter.`,
      });
    } else {
      // Reject or delete
      await supabase.from('team_members').delete().ilike('email', cleanEmail);
      await supabase.from('employees').delete().ilike('email', cleanEmail);

      return NextResponse.json({
        success: true,
        message: `🗑️ Demande/Accès retiré pour "${cleanEmail}".`,
      });
    }
  } catch (err: any) {
    console.error('Employee approve exception:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erreur lors de la validation' }, { status: 500 });
  }
}
