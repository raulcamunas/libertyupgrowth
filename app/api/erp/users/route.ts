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

export async function GET() {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error

  try {
    const supabaseAdmin = createSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('erp_user_permissions')
      .select('email, allowed_app_ids')
      .order('email', { ascending: true })

    if (error) throw error

    return NextResponse.json({ rows: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error

  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const allowedAppIds = Array.isArray(body?.allowedAppIds) ? (body.allowedAppIds as string[]) : []

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()

    await supabaseAdmin.auth.admin.inviteUserByEmail(email)

    const { error } = await supabaseAdmin
      .from('erp_user_permissions')
      .upsert({ email, allowed_app_ids: allowedAppIds }, { onConflict: 'email' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error

  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const allowedAppIds = Array.isArray(body?.allowedAppIds) ? (body.allowedAppIds as string[]) : []

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('erp_user_permissions')
      .upsert({ email, allowed_app_ids: allowedAppIds }, { onConflict: 'email' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error

  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin.from('erp_user_permissions').delete().eq('email', email)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
