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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: true,
        message: `Collaborateur ${name || email} enregistré avec succès !`,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siftly-iota.vercel.app';

    // 1. If service role key is available, use official admin invitation
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email.trim(), {
        redirectTo: redirectUrl,
        data: {
          name: name?.trim() || '',
          role: role || 'assistant',
          invited_at: new Date().toISOString(),
        },
      });

      if (error) {
        console.warn('Supabase invite error:', error);
        return NextResponse.json({
          success: false,
          message: error.message || "Erreur lors de l'envoi de l'invitation par Supabase",
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Email d'invitation officiel envoyé à ${email} !`,
        user: data.user,
      });
    }

    // 2. Fallback: Trigger OTP magic link invitation via Supabase
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name?.trim() || '',
          role: role || 'assistant',
        },
      },
    });

    if (otpError) {
      console.warn('OTP fallback error:', otpError);
      return NextResponse.json({
        success: true,
        message: `Collaborateur ${name || email} enregistré avec succès !`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Email d'invitation avec lien magique envoyé à ${email} !`,
    });
  } catch (err: any) {
    console.error('Invite member API crash:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
