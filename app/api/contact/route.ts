import { NextRequest, NextResponse } from 'next/server'

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
  if (!emailRegex.test(data.email)) {
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

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET
  
  if (!secret) {
    console.warn('Cloudflare Turnstile secret not configured')
    return true // Permitir si no está configurado
  }
  
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    )
    
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    console.log('📥 Form submission received:', {
      hasToken: !!body.cfTurnstileToken,
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
    
    // 2. Verificar Cloudflare Turnstile
    if (body.cfTurnstileToken) {
      const isValid = await verifyTurnstile(body.cfTurnstileToken, ip)
      console.log('🔐 Turnstile verification:', isValid ? '✅ Valid' : '❌ Invalid')
      if (!isValid) {
        return NextResponse.json(
          { error: 'Verification failed. Please try again.' },
          { status: 400 }
        )
      }
    } else {
      // Si no hay token, rechazar (requerido)
      console.log('❌ No Turnstile token provided')
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      )
    }
    
    // 3. Validar datos del formulario
    const validation = validateFormData(body)
    if (!validation.valid) {
      console.log('❌ Form validation failed:', validation.error)
      return NextResponse.json(
        { error: validation.error || 'Invalid form data' },
        { status: 400 }
      )
    }
    
    // 4. Enviar a webhook (tu endpoint actual)
    const webhookData = {
      name: body.name,
      phone: `${body.prefix || '+34'} ${body.phone}`,
      email: body.email,
      vendeEnAmazon: body.isSeller ? 'Sí' : 'No',
      sellingDuration: body.sellingDuration || '',
      monthlyRevenue: body.monthlyRevenue || '',
      source: 'Hero Form',
      timestamp: new Date().toISOString(),
      ip: ip,
    }
    
    console.log('📤 Sending to webhook:', webhookData)
    
    const webhookResponse = await fetch(
      'https://n8n-n8n.hyonwd.easypanel.host/webhook/08ef2386-67c2-46e0-9bd8-5084f6908215',
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



