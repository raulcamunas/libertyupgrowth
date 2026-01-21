import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Endpoint para publicar posts programados automáticamente
 * Este endpoint debe ser llamado periódicamente (cada minuto) por un cron job
 * o función de Supabase Edge Function
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar que la petición viene de una fuente autorizada
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    
    // Buscar posts programados cuya fecha de publicación ya pasó
    const now = new Date().toISOString()
    
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('status', 'scheduled')
      .lte('published_at', now)
    
    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError)
      return NextResponse.json(
        { error: 'Error fetching scheduled posts', details: fetchError.message },
        { status: 500 }
      )
    }
    
    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts to publish',
        published: 0
      })
    }
    
    // Publicar todos los posts programados cuya fecha ya pasó
    const postIds = scheduledPosts.map(post => post.id)
    
    const { data: updatedPosts, error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published',
        updated_at: now
      })
      .in('id', postIds)
      .select('id, title, slug')
    
    if (updateError) {
      console.error('Error publishing posts:', updateError)
      return NextResponse.json(
        { error: 'Error publishing posts', details: updateError.message },
        { status: 500 }
      )
    }
    
    console.log(`✅ Published ${updatedPosts?.length || 0} scheduled posts:`, 
      updatedPosts?.map(p => p.title).join(', '))
    
    return NextResponse.json({
      success: true,
      message: `Published ${updatedPosts?.length || 0} post(s)`,
      published: updatedPosts?.length || 0,
      posts: updatedPosts
    })
  } catch (error: any) {
    console.error('Error in publish-scheduled route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// También permitir GET para testing manual
export async function GET(request: NextRequest) {
  return POST(request)
}

