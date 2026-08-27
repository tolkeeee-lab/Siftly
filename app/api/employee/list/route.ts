import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tkbqmthwqxvevlrqrann.supabase.co';
  let cleanUrl = rawUrl.trim().replace(/['"]/g, '');
  try {
    cleanUrl = new URL(cleanUrl).origin;
  } catch (e) {
    cleanUrl = cleanUrl.split('/rest/v1')[0].split('/graphql')[0];
  }
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '').replace(/\r?\n|\r/g, '');
  return createClient(cleanUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId');
    const shopCode = searchParams.get('shopCode');

    const supabase = getAdminSupabase();

    let pendingQuery = supabase.from('employees').select('*').eq('status', 'pending');
    if (ownerId && ownerId !== 'guest') {
      pendingQuery = pendingQuery.eq('owner_id', ownerId);
    } else if (shopCode) {
      pendingQuery = pendingQuery.ilike('shop_code', shopCode.trim());
    }

    const { data: pendingEmployees, error } = await pendingQuery;

    if (error) {
      console.warn('Error fetching pending employees:', error);
      return NextResponse.json({ pending: [] });
    }

    return NextResponse.json({ pending: pendingEmployees || [] });
  } catch (err: any) {
    console.error('List pending employees exception:', err);
    return NextResponse.json({ pending: [] }, { status: 500 });
  }
}
