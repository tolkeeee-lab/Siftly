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

// POST /api/workspace/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products } = body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: true });
    }

    const supabase = getAdminSupabase();
    
    // Process rows
    const { error } = await supabase.from('products').upsert(products, { onConflict: 'id' });
    
    if (error && (error.code === 'PGRST204' || error.message?.includes('user_id'))) {
      const fallbackRows = products.map((p: any) => {
        const copy = { ...p };
        delete copy.user_id;
        return copy;
      });
      const retry = await supabase.from('products').upsert(fallbackRows, { onConflict: 'id' });
      if (retry.error) throw retry.error;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Workspace products POST exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
