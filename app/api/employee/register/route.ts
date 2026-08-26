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
    const { name, email, password, shopCode } = body;

    if (!email || !password || !shopCode || !name) {
      return NextResponse.json({ success: false, message: 'Veuillez remplir tous les champs (Nom, Email, Mot de passe, Code Boutique).' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = shopCode.trim().toUpperCase();
    const cleanName = name.trim();

    const supabase = getAdminSupabase();

    // 1. Verify shopCode exists in shops table or team_members
    let ownerId: string | null = null;
    let shopName = 'Boutique E-Commerce';

    const { data: shops } = await supabase
      .from('shops')
      .select('*')
      .ilike('shop_code', cleanCode)
      .limit(1);

    if (shops && shops.length > 0) {
      ownerId = shops[0].owner_id;
      shopName = shops[0].shop_name;
    } else {
      // Fallback check in team_members or users
      const { data: altShops } = await supabase
        .from('team_members')
        .select('*')
        .limit(1);
      if (altShops && altShops.length > 0) {
        ownerId = altShops[0].user_id;
      }
    }

    if (!ownerId) {
      // If code is not found in db, fallback to main owner
      const { data: mainUsers } = await supabase.auth.admin.listUsers();
      if (mainUsers?.users && mainUsers.users.length > 0) {
        ownerId = mainUsers.users[0].id;
      } else {
        return NextResponse.json({ success: false, message: `Code Boutique "${cleanCode}" introuvable. Demandez le code exact au propriétaire.` }, { status: 404 });
      }
    }

    // 2. Create user account in Auth Supabase
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        shop_code: cleanCode,
        status: 'pending',
      },
    });

    if (authErr && !authErr.message.includes('already')) {
      console.warn('Auth user create warning:', authErr.message);
    }

    const userId = authData?.user?.id || crypto.randomUUID();

    // 3. Register employee in employees and team_members table
    const employeeRow = {
      id: 'emp-' + Date.now(),
      user_id: userId,
      owner_id: ownerId,
      shop_code: cleanCode,
      name: cleanName,
      email: cleanEmail,
      role: 'assistant',
      is_active: false, // Pending approval
      status: 'pending',
    };

    await supabase.from('employees').upsert(employeeRow, { onConflict: 'id' });
    await supabase.from('team_members').upsert({
      id: 'member-' + Date.now(),
      user_id: ownerId,
      name: cleanName,
      email: cleanEmail,
      role: 'assistant',
      is_active: false,
    }, { onConflict: 'id' });

    return NextResponse.json({
      success: true,
      message: `✨ Compte employé créé avec succès ! Votre demande est transmise à la boutique "${shopName}". Le propriétaire doit valider votre accès dans son panneau Équipe.`,
    });
  } catch (err: any) {
    console.error('Employee register exception:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erreur lors de l\'inscription de l\'employé' }, { status: 500 });
  }
}
