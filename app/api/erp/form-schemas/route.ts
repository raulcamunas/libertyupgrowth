import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'
import { getDefaultFormSchema, listBusinessTypes, type BusinessType } from '@/lib/forms/schema'

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase is not configured (missing URL or SERVICE_ROLE_KEY).')
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {},
    },
  })
}

async function requireLibertyUpgrowthEmail() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || (user.email || '').toLowerCase() !== 'libertyupgrowth@gmail.com') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user }
}

function normalizeBusinessType(v: string | null): BusinessType | null {
  const t = String(v || '').trim().toLowerCase()
  const allowed = new Set(listBusinessTypes())
  if (!t || !allowed.has(t as any)) return null
  return t as BusinessType
}

export async function GET(request: Request) {
  const gate = await requireLibertyUpgrowthEmail()
  if ('error' in gate) return gate.error

  try {
    const url = new URL(request.url)
    const bt = normalizeBusinessType(url.searchParams.get('businessType'))
    const supabaseAdmin = createSupabaseAdmin()

    if (bt) {
      const { data, error } = await supabaseAdmin.from('erp_form_schemas').select('schema').eq('business_type', bt).maybeSingle()
      if (error) throw error
      const schema = (data as any)?.schema || getDefaultFormSchema(bt)
      return NextResponse.json({ schema })
    }

    const { data, error } = await supabaseAdmin.from('erp_form_schemas').select('business_type, schema')
    if (error) throw error

    const map = new Map<string, any>()
    for (const row of data || []) {
      map.set(String((row as any).business_type || ''), (row as any).schema)
    }

    const schemas = listBusinessTypes().map((t) => map.get(t) || getDefaultFormSchema(t))
    return NextResponse.json({ schemas })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const gate = await requireLibertyUpgrowthEmail()
  if ('error' in gate) return gate.error

  try {
    const body = await request.json()
    const bt = normalizeBusinessType(body?.businessType)
    const schema = body?.schema

    if (!bt) return NextResponse.json({ error: 'Invalid businessType' }, { status: 400 })
    if (!schema || typeof schema !== 'object') return NextResponse.json({ error: 'Missing schema' }, { status: 400 })

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin.from('erp_form_schemas').upsert(
      {
        business_type: bt,
        schema,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'business_type' }
    )

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
