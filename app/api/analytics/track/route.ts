import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar que el body tenga los campos mínimos requeridos
    if (!body.page_path || !body.session_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    try {
      const supabase = await createClient()
      
      // Obtener IP del cliente (si está disponible)
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
      
      // Insertar evento en analytics_events
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          page_path: body.page_path,
          page_title: body.page_title || null,
          page_type: body.page_type || null,
          post_id: body.post_id || null,
          post_slug: body.post_slug || null,
          session_id: body.session_id,
          user_agent: body.user_agent || null,
          referrer: body.referrer || null,
          device_type: body.device_type || null,
          browser: body.browser || null,
          os: body.os || null,
          time_on_page: body.time_on_page || null,
          scroll_depth: body.scroll_depth || null,
          ip_address: ip,
          metadata: body.metadata || null,
        })
      
      if (error) {
        console.error('Error inserting analytics event:', error)
        // Si la tabla no existe o hay un error de conexión, devolver 200 para no romper el sitio
        // pero loguear el error para debugging
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 200 })
      }
      
      return NextResponse.json({ success: true })
    } catch (dbError) {
      // Si hay un error de conexión a Supabase, no romper el sitio
      console.error('Database connection error:', dbError)
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 200 })
    }
  } catch (error) {
    console.error('Error in analytics track route:', error)
    // En caso de error, devolver 200 para no romper el sitio
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 200 })
  }
}


