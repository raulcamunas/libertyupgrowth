import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsStats } from '@/app/actions/analytics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const endDate = new Date()
    
    const stats = await getAnalyticsStats(startDate, endDate)
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Unauthorized or no data' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in analytics stats route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

