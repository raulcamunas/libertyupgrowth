'use server'

import { createClient } from '@/lib/supabase/server'

export interface AnalyticsStats {
  total_views: number
  unique_visitors: number
  unique_sessions: number
  avg_time_on_page: number
  top_pages: Array<{
    path: string
    views: number
    unique_visits: number
  }>
  top_posts: Array<{
    slug: string
    post_id: string
    views: number
    unique_visits: number
  }>
  views_by_day: Array<{
    date: string
    views: number
    unique_visits: number
  }>
  device_breakdown: Array<{
    device: string
    views: number
  }>
}

export async function getAnalyticsStats(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsStats | null> {
  const supabase = await createClient()
  
  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 días atrás
  const end = endDate || new Date()
  
  // Llamar a la función de Supabase
  const { data, error } = await supabase.rpc('get_analytics_stats', {
    start_date: start.toISOString(),
    end_date: end.toISOString(),
  })
  
  if (error) {
    console.error('Error fetching analytics stats:', error)
    return null
  }
  
  if (!data || data.length === 0) {
    return {
      total_views: 0,
      unique_visitors: 0,
      unique_sessions: 0,
      avg_time_on_page: 0,
      top_pages: [],
      top_posts: [],
      views_by_day: [],
      device_breakdown: [],
    }
  }
  
  const stats = data[0]
  
  return {
    total_views: Number(stats.total_views) || 0,
    unique_visitors: Number(stats.unique_visitors) || 0,
    unique_sessions: Number(stats.unique_sessions) || 0,
    avg_time_on_page: Number(stats.avg_time_on_page) || 0,
    top_pages: (stats.top_pages as any[]) || [],
    top_posts: (stats.top_posts as any[]) || [],
    views_by_day: (stats.views_by_day as any[]) || [],
    device_breakdown: (stats.device_breakdown as any[]) || [],
  }
}

export async function getPostViews(postId: string): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)
  
  if (error) {
    console.error('Error fetching post views:', error)
    return 0
  }
  
  return count || 0
}

export async function getPostUniqueVisitors(postId: string): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('analytics_events')
    .select('session_id', { count: 'exact', head: true })
    .eq('post_id', postId)
  
  if (error) {
    console.error('Error fetching post unique visitors:', error)
    return 0
  }
  
  // Necesitamos contar sesiones únicas, no filas
  const { data, error: distinctError } = await supabase
    .from('analytics_events')
    .select('session_id')
    .eq('post_id', postId)
  
  if (distinctError) {
    console.error('Error fetching distinct sessions:', distinctError)
    return 0
  }
  
  const uniqueSessions = new Set(data?.map((e) => e.session_id) || [])
  return uniqueSessions.size
}

