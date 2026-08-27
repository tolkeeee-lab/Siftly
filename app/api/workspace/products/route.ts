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

// GET /api/workspace/products?ownerId=uuid
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId');

    const supabase = getAdminSupabase();
    let data: any[] | null = null;
    const isUuid = ownerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId);

    if (isUuid) {
      const res = await supabase
        .from('products')
        .select('*')
        .eq('user_id', ownerId)
        .order('seq', { ascending: true });
      if (res.data) {
        data = res.data;
      }
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: any) {
    console.error('Workspace products exception:', err);
    return NextResponse.json({ products: [], error: err.message }, { status: 500 });
  }
}
