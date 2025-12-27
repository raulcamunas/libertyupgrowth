'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAnalyticsStats, AnalyticsStats } from '@/app/actions/analytics'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AnalyticsDashboardProps {
  initialStats: AnalyticsStats | null
}

export default function AnalyticsDashboard({ initialStats }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<AnalyticsStats | null>(initialStats)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | '365'>('30')

  const fetchStats = async (days: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/stats?days=${days}`)
      if (response.ok) {
        const newStats = await response.json()
        setStats(newStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const days = parseInt(dateRange)
    fetchStats(days)
  }, [dateRange])

  if (!stats) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-icon">
          <i className="fa-solid fa-chart-line"></i>
        </div>
        <h3 className="admin-empty-title">No hay datos disponibles</h3>
        <p className="admin-empty-text">
          Los datos de analytics aparecerán aquí una vez que tengas visitas en tu sitio.
        </p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Métricas de Rendimiento</h2>
          <p className="text-sm text-gray-500">Análisis de visitas y comportamiento</p>
        </div>
        <div className="flex gap-2">
          {(['7', '30', '90', '365'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                dateRange === days
                  ? 'admin-primary-button'
                  : 'admin-secondary-button'
              }`}
            >
              {days === '7' ? '7 días' : days === '30' ? '30 días' : days === '90' ? '90 días' : '1 año'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-[#FF6600]"></i>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="admin-stat-card">
              <div className="admin-stat-icon bg-blue-500/20 text-blue-400">
                <i className="fa-solid fa-eye"></i>
              </div>
              <div>
                <p className="admin-stat-value">{stats.total_views.toLocaleString()}</p>
                <p className="admin-stat-label">Total Visitas</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon bg-green-500/20 text-green-400">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <p className="admin-stat-value">{stats.unique_visitors.toLocaleString()}</p>
                <p className="admin-stat-label">Visitantes Únicos</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon bg-purple-500/20 text-purple-400">
                <i className="fa-solid fa-window-restore"></i>
              </div>
              <div>
                <p className="admin-stat-value">{stats.unique_sessions.toLocaleString()}</p>
                <p className="admin-stat-label">Sesiones</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon bg-orange-500/20 text-orange-400">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <p className="admin-stat-value">{formatTime(Math.round(stats.avg_time_on_page))}</p>
                <p className="admin-stat-label">Tiempo Promedio</p>
              </div>
            </div>
          </div>

          {/* Top Pages */}
          {stats.top_pages && stats.top_pages.length > 0 && (
            <div className="admin-form-section">
              <div className="admin-section-header">
                <i className="fa-solid fa-file-alt mr-2 text-[#FF6600]"></i>
                <h3 className="admin-section-title">Páginas Más Visitadas</h3>
              </div>
              <div className="mt-6 space-y-3">
                {stats.top_pages.map((page, index) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6600]/20 text-[#FF6600] flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{page.path}</p>
                        <p className="text-sm text-gray-500">
                          {page.unique_visits} visitantes únicos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#FF6600]">{page.views}</p>
                      <p className="text-xs text-gray-500">visitas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Posts */}
          {stats.top_posts && stats.top_posts.length > 0 && (
            <div className="admin-form-section">
              <div className="admin-section-header">
                <i className="fa-solid fa-newspaper mr-2 text-[#FF6600]"></i>
                <h3 className="admin-section-title">Posts Más Populares</h3>
              </div>
              <div className="mt-6 space-y-3">
                {stats.top_posts.map((post, index) => (
                  <div
                    key={post.post_id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6600]/20 text-[#FF6600] flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">/blog/{post.slug}</p>
                        <p className="text-sm text-gray-500">
                          {post.unique_visits} visitantes únicos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#FF6600]">{post.views}</p>
                        <p className="text-xs text-gray-500">visitas</p>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="admin-action-button admin-action-view"
                        title="Ver post"
                      >
                        <i className="fa-solid fa-external-link"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Device Breakdown */}
          {stats.device_breakdown && stats.device_breakdown.length > 0 && (
            <div className="admin-form-section">
              <div className="admin-section-header">
                <i className="fa-solid fa-mobile-alt mr-2 text-[#FF6600]"></i>
                <h3 className="admin-section-title">Dispositivos</h3>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.device_breakdown.map((device) => {
                  const percentage = stats.total_views > 0
                    ? Math.round((device.views / stats.total_views) * 100)
                    : 0
                  
                  return (
                    <div
                      key={device.device}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white capitalize">{device.device}</p>
                        <p className="text-sm text-gray-400">{percentage}%</p>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-[#FF6600] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{device.views} visitas</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Views by Day Chart */}
          {stats.views_by_day && stats.views_by_day.length > 0 && (
            <div className="admin-form-section">
              <div className="admin-section-header">
                <i className="fa-solid fa-chart-line mr-2 text-[#FF6600]"></i>
                <h3 className="admin-section-title">Visitas por Día</h3>
              </div>
              <div className="mt-6">
                <div className="space-y-2">
                  {stats.views_by_day.map((day) => {
                    const maxViews = Math.max(...stats.views_by_day.map(d => d.views))
                    const percentage = maxViews > 0 ? (day.views / maxViews) * 100 : 0
                    const date = new Date(day.date)
                    
                    return (
                      <div key={day.date} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-gray-400">
                          {format(date, 'dd MMM', { locale: es })}
                        </div>
                        <div className="flex-1 bg-white/10 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#FF6600] to-[#FF8533] h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 10 && (
                              <span className="text-xs font-bold text-white">
                                {day.views}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-20 text-right">
                          <p className="text-sm font-medium text-white">{day.views}</p>
                          <p className="text-xs text-gray-500">{day.unique_visits} únicos</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

