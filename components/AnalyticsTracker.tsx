'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent, trackTimeOnPage, trackScrollDepth } from '@/lib/analytics'

interface AnalyticsTrackerProps {
  pageType?: 'home' | 'blog' | 'blog_post' | 'admin' | 'other'
  postId?: string
  postSlug?: string
}

export default function AnalyticsTracker({
  pageType = 'other',
  postId,
  postSlug,
}: AnalyticsTrackerProps) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Trackear visita a la página
    trackEvent({
      page_path: pathname,
      page_type: pageType,
      post_id: postId,
      post_slug: postSlug,
    })
    
    // Trackear tiempo en página
    const cleanupTimeTracking = trackTimeOnPage()
    
    // Trackear profundidad de scroll
    trackScrollDepth()
    
    // Cleanup al salir de la página
    return () => {
      if (cleanupTimeTracking) {
        cleanupTimeTracking()
      }
    }
  }, [pathname, pageType, postId, postSlug])
  
  return null
}

