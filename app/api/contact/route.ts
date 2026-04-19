import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rate limiting simple en memoria (en producción usar Redis)
const submissions = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT = {
  maxSubmissions: 5,
  windowMs: 60 * 60 * 1000, // 1 hora
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = submissions.get(ip)
  
  if (!record || now > record.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    return true
  }
  
  if (record.count >= RATE_LIMIT.maxSubmissions) {
    return false
  }
  
  record.count++
  return true
}

function validateFormData(data: any): { valid: boolean; error?: string } {
  // Validar honeypot
  if (data.website && data.website.trim() !== '') {
    return { valid: false, error: 'Bot detected' }
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (data.email && !emailRegex.test(data.email)) {
    return { valid: false, error: 'Invalid email' }
  }
  
  // Validar nombre (mínimo 2 caracteres)
  if (!data.name || data.name.trim().length < 2) {
    return { valid: false, error: 'Invalid name' }
  }
  
  // Validar teléfono (básico)
  const cleanPhone = data.phone?.replace(/[\s\-\(\)]/g, '') || ''
  if (cleanPhone.length < 8) {
    return { valid: false, error: 'Invalid phone' }
  }
  
  return { valid: true }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    console.log('📥 Form submission received:', {
      name: body.name,
      email: body.email,
      ip: ip
    })
    
    // 1. Verificar rate limit
    if (!checkRateLimit(ip)) {
      console.log('❌ Rate limit exceeded for IP:', ip)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // 2. Validar datos del formulario
    const validation = validateFormData(body)
    if (!validation.valid) {
      console.log('❌ Form validation failed:', validation.error)
      return NextResponse.json(
        { error: validation.error || 'Invalid form data' },
        { status: 400 }
      )
    }
    
    // 4. Enviar a webhook (tu endpoint actual)
    const usaAgendaDigital =
      typeof body.usaAgendaDigital === 'string'
        ? body.usaAgendaDigital
        : body.isSeller
          ? 'Sí'
          : 'No'

    const webhookData = {
      name: body.name,
      phone: `${body.prefix || '+34'} ${body.phone}`,
      email: body.email || '',
      businessType: body.businessType || '',
      usaAgendaDigital,
      empleados: body.empleados || '',
      source: 'Hero Form',
      timestamp: new Date().toISOString(),
      ip: ip,
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRoleKey) {
      try {
        const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, {
          cookies: {
            getAll() {
              return []
            },
            setAll() {},
          },
        })

        const leadKey = (webhookData.email || '').trim()
          ? `hero:${(webhookData.email || '').trim().toLowerCase()}`
          : `hero:${(webhookData.phone || '').trim().replace(/\s+/g, '')}:${webhookData.timestamp}`

        await supabaseAdmin
          .from('leads')
          .upsert(
            {
              lead_key: leadKey,
              source: 'Hero Form',
              name: webhookData.name || null,
              email: webhookData.email || null,
              phone: webhookData.phone || null,
              status: 'new',
              payload: webhookData,
            },
            { onConflict: 'lead_key' }
          )
      } catch {
        // ignorar para no romper el formulario
      }
    }
    
    console.log('📤 Sending to webhook:', webhookData)

    const webhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      'https://n8n-n8n.hyonwd.easypanel.host/webhook/df995535-e426-4691-9d8f-cb326bd9640f'
    
    const webhookResponse = await fetch(
      webhookUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      }
    )
    
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('❌ Webhook failed:', webhookResponse.status, errorText)
      throw new Error(`Webhook failed: ${webhookResponse.status}`)
    }
    
    console.log('✅ Form submitted successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Contact form error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Webhook') ? 502 : 500 }
    )
  }
}



