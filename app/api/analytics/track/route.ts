import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    
    // Obtener IP del cliente (si está disponible)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Insertar evento en analytics_events
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        page_path: body.page_path,
        page_title: body.page_title,
        page_type: body.page_type,
        post_id: body.post_id || null,
        post_slug: body.post_slug || null,
        session_id: body.session_id,
        user_agent: body.user_agent,
        referrer: body.referrer || null,
        device_type: body.device_type,
        browser: body.browser,
        os: body.os,
        time_on_page: body.time_on_page || null,
        scroll_depth: body.scroll_depth || null,
        ip_address: ip,
        metadata: body.metadata || null,
      })
    
    if (error) {
      console.error('Error inserting analytics event:', error)
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in analytics track route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


