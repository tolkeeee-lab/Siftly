import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tkbqmthwqxvevlrqrann.supabase.co';
  let cleanUrl = rawUrl.trim().replace(/['"]/g, '').replace(/\/+$/, '');
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = `https://${cleanUrl}`;
  }
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .trim().replace(/['"]/g, '').replace(/\r?\n|\r/g, '');
  
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

    // 1. Verify shopCode exists in shops table or resolve ownerId
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
      // Find main owner from Auth users or team_members
      const { data: mainUsers } = await supabase.auth.admin.listUsers();
      if (mainUsers?.users && mainUsers.users.length > 0) {
        ownerId = mainUsers.users[0].id;
        // Auto-create shop row for future lookups
        await supabase.from('shops').upsert({
          owner_id: ownerId,
          shop_name: 'Ma Boutique E-Commerce',
          shop_code: cleanCode,
        }, { onConflict: 'owner_id' });
      } else {
        ownerId = 'owner-main';
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

    let userId = authData?.user?.id;

    if (authErr) {
      if (authErr.message.includes('already')) {
        // User already exists in auth.users, we need to fetch their real ID to avoid FK violations
        const { data: existingUsers, error: searchErr } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === cleanEmail);
        
        if (existingUser) {
          userId = existingUser.id;
        } else {
          return NextResponse.json({ success: false, message: 'Ce compte existe déjà mais est introuvable. Veuillez contacter le support.' }, { status: 400 });
        }
      } else {
        console.error('Auth user create error:', authErr.message);
        return NextResponse.json({ success: false, message: `Erreur d'authentification: ${authErr.message}` }, { status: 500 });
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Erreur lors de la création de l\'utilisateur (ID manquant).' }, { status: 500 });
    }

    // 3. Register employee in employees and team_members table
    const employeeRow = {
      id: crypto.randomUUID(),
      user_id: userId,
      owner_id: ownerId,
      shop_code: cleanCode,
      name: cleanName,
      email: cleanEmail,
      role: 'assistant',
      is_active: false, // Pending approval
      status: 'pending',
    };

    const { error: empErr } = await supabase.from('employees').upsert(employeeRow, { onConflict: 'id' });
    if (empErr) {
      console.error('Error inserting employee:', empErr);
      return NextResponse.json({ success: false, message: `DB Error (employees): ${empErr.message}` }, { status: 500 });
    }

    const { error: teamErr } = await supabase.from('team_members').upsert({
      id: crypto.randomUUID(),
      user_id: ownerId,
      name: cleanName,
      email: cleanEmail,
      role: 'assistant',
      is_active: false,
    }, { onConflict: 'id' });
    
    if (teamErr) {
      console.error('Error inserting team_member:', teamErr);
      return NextResponse.json({ success: false, message: `DB Error (team_members): ${teamErr.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `✨ Compte employé créé avec succès ! Votre demande est transmise à la boutique "${shopName}". Le propriétaire doit valider votre accès dans son panneau Équipe.`,
    });
  } catch (err: any) {
    console.error('Employee register exception:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erreur lors de l\'inscription de l\'employé' }, { status: 500 });
  }
}
