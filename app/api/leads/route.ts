import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEADS_INGEST_SECRET
    const provided = request.headers.get('x-leads-secret') || request.nextUrl.searchParams.get('secret')

    if (secret && provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured (missing URL or SERVICE_ROLE_KEY).' },
        { status: 500 }
      )
    }

    const body = await request.json()

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null

    const payload = {
      ...body,
      ip,
      user_agent: request.headers.get('user-agent') || null,
      received_at: new Date().toISOString(),
    }

    const leadKey: string | null =
      typeof body?.lead_key === 'string'
        ? body.lead_key
        : typeof body?.rowId === 'string'
          ? body.rowId
          : typeof body?.id === 'string'
            ? body.id
            : null

    const source: string | null = typeof body?.source === 'string' ? body.source : 'Google Sheets'

    const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    const { data, error } = await supabaseAdmin
      .from('leads')
      .upsert(
        {
          lead_key: leadKey,
          source,
          name: typeof body?.name === 'string' ? body.name : null,
          email: typeof body?.email === 'string' ? body.email : null,
          phone: typeof body?.phone === 'string' ? body.phone : null,
          status: typeof body?.status === 'string' ? body.status : 'new',
          payload,
        },
        { onConflict: 'lead_key' }
      )
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
