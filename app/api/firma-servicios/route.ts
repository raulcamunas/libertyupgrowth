import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const webhookUrl =
      process.env.N8N_FIRMA_SERVICIOS_WEBHOOK_URL ||
      process.env.N8N_WEBHOOK_URL ||
      'https://n8n-n8n.hyonwd.easypanel.host/webhook/51048a0f-64fe-44bb-9866-dd9452e2e699'

    let webhookResponse: Response

    if (contentType.includes('multipart/form-data')) {
      const incoming = await request.formData()
      const outgoing = new FormData()

      for (const [key, value] of incoming.entries()) {
        outgoing.append(key, value)
      }

      outgoing.set('source', String(incoming.get('source') || 'Firma Servicios'))
      outgoing.set('ip', ip)
      outgoing.set('timestamp', new Date().toISOString())
      outgoing.set('event', 'service_contract_signed')

      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        body: outgoing,
      })
    } else {
      const body = await request.json()
      const payload = {
        ...body,
        source: body?.source || 'Firma Servicios',
        ip,
        timestamp: new Date().toISOString(),
        event: 'service_contract_signed',
      }

      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

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
