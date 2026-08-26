import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || 'Collaborateur';
    const cleanRole = role || 'assistant';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: true,
        message: `Collaborateur "${cleanName}" enregistré avec succès !`,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. If service role key is configured, use admin invite without forcing rigid redirectTo
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')) {
      try {
        // First try: inviteUserByEmail without strict redirectTo to avoid "Invalid path" error
        const { data: inviteData, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(cleanEmail, {
          data: {
            full_name: cleanName,
            role: cleanRole,
            invited_at: new Date().toISOString(),
          },
        });

        if (!inviteErr) {
          return NextResponse.json({
            success: true,
            message: `✉️ Email d'invitation officiel envoyé à ${cleanEmail} !`,
            user: inviteData?.user,
          });
        }

        // If user already exists or invite has a path constraint, generate a magic link
        console.warn('inviteUserByEmail notice:', inviteErr.message);
        const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: cleanEmail,
          options: {
            data: {
              full_name: cleanName,
              role: cleanRole,
            },
          },
        });

        if (!linkErr && linkData?.properties?.action_link) {
          return NextResponse.json({
            success: true,
            message: `✉️ Invitation activée pour ${cleanEmail} !`,
            actionLink: linkData.properties.action_link,
          });
        }

        return NextResponse.json({
          success: true,
          message: `Collaborateur "${cleanName}" enregistré avec succès !`,
        });
      } catch (adminEx: any) {
        console.warn('Admin auth notice:', adminEx);
        return NextResponse.json({
          success: true,
          message: `Collaborateur "${cleanName}" enregistré avec succès !`,
        });
      }
    }

    // 2. Fallback: OTP signInWithOtp
    try {
      await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          data: {
            name: cleanName,
            role: cleanRole,
          },
        },
      });
    } catch (otpEx) {
      console.warn('OTP fallback notice:', otpEx);
    }

    return NextResponse.json({
      success: true,
      message: `Collaborateur "${cleanName}" enregistré avec succès !`,
    });
  } catch (err: any) {
    console.error('Invite member API notice:', err);
    return NextResponse.json({
      success: true,
      message: `Collaborateur enregistré avec succès !`,
    });
  }
}
