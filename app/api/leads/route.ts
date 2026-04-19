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

    const raw = body?.raw && typeof body.raw === 'object' ? body.raw : body

    const adsetName: string | null =
      typeof body?.adset_name === 'string'
        ? body.adset_name
        : typeof raw?.adset_name === 'string'
          ? raw.adset_name
          : null

    const painPoint: string | null =
      typeof body?.pain_point === 'string'
        ? body.pain_point
        : typeof raw?.['¿qué_es_lo_que_más_te_quema_de_gestionar_tus_citas_manualmente?'] === 'string'
          ? raw?.['¿qué_es_lo_que_más_te_quema_de_gestionar_tus_citas_manualmente?']
          : null

    const currentSituation: string | null =
      typeof body?.current_situation === 'string'
        ? body.current_situation
        : typeof raw?.['¿cuál_es_tu_situación_actual_con_la_gestión_de_citas?'] === 'string'
          ? raw?.['¿cuál_es_tu_situación_actual_con_la_gestión_de_citas?']
          : null

    const notes: string | null = typeof body?.notes === 'string' ? body.notes : null

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
          adset_name: adsetName,
          pain_point: painPoint,
          current_situation: currentSituation,
          notes,
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
