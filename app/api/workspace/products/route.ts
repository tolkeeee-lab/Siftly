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

    if (!ownerId) {
      return NextResponse.json({ products: [] });
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', ownerId)
      .order('seq', { ascending: true });

    if (error) {
      console.warn('API fetch owner products error:', error);
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: any) {
    console.error('Workspace products exception:', err);
    return NextResponse.json({ products: [], error: err.message }, { status: 500 });
  }
}
