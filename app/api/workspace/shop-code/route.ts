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

function getDeterministicCode(userId?: string, email?: string, shopName?: string): string {
  const prefix = (shopName || 'MABO')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase() || 'MABO';

  const baseStr = userId || email || 'default-owner';
  let hash = 0;
  for (let i = 0; i < baseStr.length; i++) {
    hash = (hash << 5) - hash + baseStr.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash % 8999) + 1000;
  return `${prefix}-${num}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const shopName = searchParams.get('shopName');

    const supabase = getAdminSupabase();

    // 1. Try to find existing shop in DB
    if (userId && userId !== 'guest') {
      const { data: shops } = await supabase
        .from('shops')
        .select('shop_code')
        .eq('owner_id', userId)
        .limit(1);

      if (shops && shops.length > 0 && shops[0].shop_code) {
        return NextResponse.json({ shopCode: shops[0].shop_code });
      }
    }

    // 2. Fallback to deterministic code (STABLE per user/email, NEVER changes randomly)
    const stableCode = getDeterministicCode(userId || undefined, email || undefined, shopName || undefined);

    // Save stable code to DB with admin client if userId exists
    if (userId && userId !== 'guest') {
      await supabase.from('shops').upsert({
        owner_id: userId,
        shop_name: shopName || 'Ma Boutique E-Commerce',
        shop_code: stableCode,
      }, { onConflict: 'owner_id' }).select();
    }

    return NextResponse.json({ shopCode: stableCode });
  } catch (err: any) {
    console.error('Shop code exception:', err);
    return NextResponse.json({ shopCode: 'MABO-8820' });
  }
}
