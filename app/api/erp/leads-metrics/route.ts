import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'

function isAdminEmail(email?: string | null) {
  const adminEmail = process.env.ERP_ADMIN_EMAIL
  if (!adminEmail || !email) return false
  return adminEmail.toLowerCase() === email.toLowerCase()
}

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

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user }
}

function isoDay(d: Date) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function GET() {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error

  try {
    const supabaseAdmin = createSupabaseAdmin()

    const from = new Date()
    from.setUTCDate(from.getUTCDate() - 29)
    from.setUTCHours(0, 0, 0, 0)

    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('created_at, source')
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: true })
      .limit(5000)

    if (error) throw error

    const byDay = new Map<string, { total: number; bySource: Record<string, number> }>()

    for (const row of data || []) {
      const createdAt = typeof (row as any)?.created_at === 'string' ? ((row as any).created_at as string) : ''
      const src = typeof (row as any)?.source === 'string' ? ((row as any).source as string) : 'Desconocido'
      const d = createdAt ? new Date(createdAt) : null
      if (!d || Number.isNaN(d.getTime())) continue

      const day = isoDay(d)
      const bucket = byDay.get(day) || { total: 0, bySource: {} }
      bucket.total += 1
      bucket.bySource[src] = (bucket.bySource[src] || 0) + 1
      byDay.set(day, bucket)
    }

    const days: Array<{ day: string; total: number; bySource: Record<string, number> }> = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      d.setUTCHours(0, 0, 0, 0)
      const day = isoDay(d)
      const bucket = byDay.get(day) || { total: 0, bySource: {} }
      days.push({ day, total: bucket.total, bySource: bucket.bySource })
    }

    return NextResponse.json({ days })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
