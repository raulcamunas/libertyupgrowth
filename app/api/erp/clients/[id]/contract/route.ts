import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'

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

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireLibertyUpgrowthEmail()
  if ('error' in gate) return gate.error

  try {
    const { id } = await context.params
    const supabaseAdmin = createSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('erp_clients')
      .select('contract_path')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    const path = (data as any)?.contract_path as string | null
    if (!path) return NextResponse.json({ error: 'No contract' }, { status: 404 })

    const { data: signed, error: signErr } = await supabaseAdmin.storage.from('erp-contracts').createSignedUrl(path, 60 * 10)
    if (signErr) throw signErr

    return NextResponse.json({ url: signed?.signedUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireLibertyUpgrowthEmail()
  if ('error' in gate) return gate.error

  try {
    const { id } = await context.params
    const form = await request.formData()
    const file = form.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF supported' }, { status: 400 })

    const supabaseAdmin = createSupabaseAdmin()

    const safeName = `${id}.pdf`
    const path = `contracts/${safeName}`
    const buf = new Uint8Array(await file.arrayBuffer())

    const { error: upErr } = await supabaseAdmin.storage.from('erp-contracts').upload(path, buf, {
      upsert: true,
      contentType: 'application/pdf',
    })

    if (upErr) throw upErr

    const { error: updErr } = await supabaseAdmin
      .from('erp_clients')
      .update({ contract_path: path, contract_signed_at: new Date().toISOString() })
      .eq('id', id)

    if (updErr) throw updErr

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
