import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
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

function normalizeBusinessType(v: string | null): BusinessType | null {
  const t = String(v || '').trim().toLowerCase()
  const allowed = new Set(listBusinessTypes())
  if (!t || !allowed.has(t as any)) return null
  return t as BusinessType
}

export async function GET(request: Request) {
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
