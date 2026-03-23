/**
 * Sistema de Analytics para Liberty UpGrowth
 * Tracking de visitas, páginas y posts del blog
 */

export interface AnalyticsEvent {
  page_path: string
  page_title?: string
  page_type: 'home' | 'blog' | 'blog_post' | 'admin' | 'other'
  post_id?: string
  post_slug?: string
  session_id: string
  user_agent?: string
  referrer?: string
  device_type?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  time_on_page?: number
  scroll_depth?: number
  metadata?: Record<string, any>
}

/**
 * Obtener o crear session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  
  return sessionId
}

/**
 * Detectar tipo de dispositivo
 */
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Detectar navegador
 */
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  return 'unknown'
}

/**
 * Detectar OS
 */
export function getOS(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'unknown'
}

/**
 * Trackear un evento de analytics
 */
export async function trackEvent(event: Partial<AnalyticsEvent>): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    const sessionId = getSessionId()
    const fullEvent: AnalyticsEvent = {
      page_path: window.location.pathname,
      page_title: document.title,
      page_type: 'other',
      session_id: sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      ...event,
    }
    
    // Enviar a Supabase
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullEvent),
    })
    
    if (!response.ok) {
      console.error('Error tracking event:', response.statusText)
    }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Trackear tiempo en página
 */
export function trackTimeOnPage(): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const startTime = Date.now()
  
  return () => {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
    trackEvent({ time_on_page: timeOnPage })
  }
}

/**
 * Trackear profundidad de scroll
 */
export function trackScrollDepth(): () => void {
  if (typeof window === 'undefined') return () => {}
  
  let maxScroll = 0
  const thresholds = [25, 50, 75, 100]
  const tracked = new Set<number>()
  
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent
      
      // Trackear cuando se alcanza un threshold
      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold)
          trackEvent({ scroll_depth: threshold })
        }
      })
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Cleanup al salir de la página
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

