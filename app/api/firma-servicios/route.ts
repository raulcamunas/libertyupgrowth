import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const webhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      'https://n8n-n8n.hyonwd.easypanel.host/webhook/df995535-e426-4691-9d8f-cb326bd9640f'

    const payload = {
      ...body,
      source: body?.source || 'Firma Servicios',
      ip,
      timestamp: new Date().toISOString(),
      event: 'service_contract_signed',
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
