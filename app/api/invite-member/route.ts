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
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        message: 'NEXT_PUBLIC_SUPABASE_URL non configuré',
      }, { status: 500 });
    }

    if (!serviceRoleKey) {
      return NextResponse.json({
        success: false,
        message: 'SUPABASE_SERVICE_ROLE_KEY manquante sur Vercel. Veuillez ajouter la clé service_role dans les variables d\'environnement Vercel et redéployer.',
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Try admin inviteUserByEmail
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

    console.warn('inviteUserByEmail error:', inviteErr.message);

    // 2. If user is already registered in Auth, send a direct magic link OTP email
    if (inviteErr.message?.toLowerCase().includes('already') || inviteErr.message?.toLowerCase().includes('registered')) {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          data: {
            full_name: cleanName,
            role: cleanRole,
          },
        },
      });

      if (!otpErr) {
        return NextResponse.json({
          success: true,
          message: `✉️ Utilisateur déjà existant : un nouvel email avec lien de connexion direct a été envoyé à ${cleanEmail} !`,
        });
      }

      return NextResponse.json({
        success: false,
        message: `Erreur Supabase : ${otpErr.message}`,
      }, { status: 500 });
    }

    // 3. Other Supabase error
    return NextResponse.json({
      success: false,
      message: `Erreur Supabase : ${inviteErr.message}`,
    }, { status: 500 });

  } catch (err: any) {
    console.error('Invite member API crash:', err);
    return NextResponse.json({
      success: false,
      message: `Erreur serveur : ${err?.message || 'Erreur inconnue'}`,
    }, { status: 500 });
  }
}
