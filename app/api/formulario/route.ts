import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const webhookUrl =
      process.env.N8N_FORMULARIO_WEBHOOK_URL ||
      'https://n8n-n8n.hyonwd.easypanel.host/webhook/form'

    const payload = {
      ...body,
      ip,
      timestamp: new Date().toISOString(),
      event: 'client_onboarding_form_submitted',
      source: body?.source || 'Formulario Liberty UpGrowth',
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceRoleKey) {
      try {
        const supabaseAdmin = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
          cookies: {
            getAll() {
              return []
            },
            setAll() {},
          },
        })

        await supabaseAdmin.from('form_submissions').insert({
          source: payload.source,
          ip,
          user_agent: request.headers.get('user-agent') || null,
          payload,
        })
      } catch {
        // Ignorar errores de persistencia para no romper el flujo hacia el webhook
      }
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      return NextResponse.json(
        {
          error: 'Webhook failed',
          status: webhookResponse.status,
          details: errorText,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
