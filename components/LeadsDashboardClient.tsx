'use client'

import { useEffect, useMemo, useState } from 'react'

type DayPoint = {
  day: string
  total: number
  bySource: Record<string, number>
}

export default function LeadsDashboardClient() {
  const [days, setDays] = useState<DayPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const maxTotal = useMemo(() => Math.max(1, ...days.map((d) => d.total)), [days])

  const sources = useMemo(() => {
    const set = new Set<string>()
    for (const d of days) {
      Object.keys(d.bySource || {}).forEach((s) => set.add(s))
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [days])

  useEffect(() => {
    const load = async () => {
      setError('')
      setLoading(true)
      try {
        const res = await fetch('/api/erp/leads-metrics', { method: 'GET' })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'No se ha podido cargar')
        setDays((data?.days || []) as DayPoint[])
      } catch (e: any) {
        setError(e?.message || 'No se ha podido cargar')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="erp-miniapp-title">Dashboard</div>
        <div className="erp-miniapp-subtitle">Leads nuevos por día (últimos 30 días)</div>

        {error ? <div className="leads-add-error">{error}</div> : null}

        {loading ? (
          <div className="erp-miniapp-empty">Cargando...</div>
        ) : days.length === 0 ? (
          <div className="erp-miniapp-empty">No hay datos.</div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                height: 160,
                padding: 12,
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(0,0,0,0.18)',
                overflowX: 'auto',
              }}
              aria-label="Gráfica de leads por día"
            >
              {days.map((d) => {
                const h = Math.round((d.total / maxTotal) * 140)
                return (
                  <div key={d.day} style={{ width: 18, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                    <div
                      title={`${d.day}: ${d.total}`}
                      style={{
                        width: 14,
                        height: h,
                        borderRadius: 8,
                        background: 'linear-gradient(180deg, rgba(0,181,255,0.90), rgba(0,120,255,0.35))',
                        border: '1px solid rgba(0,181,255,0.25)',
                      }}
                    />
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.50)', whiteSpace: 'nowrap' }}>{d.day.slice(5)}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.90)' }}>Desglose por día y fuente</div>
              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                {days
                  .slice()
                  .reverse()
                  .map((d) => (
                    <div
                      key={`row-${d.day}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 70px 1fr',
                        gap: 10,
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 14,
                        border: '1px solid rgba(255,255,255,0.10)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.82)' }}>{d.day}</div>
                      <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{d.total}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
                        {sources.map((s) => {
                          const v = d.bySource?.[s] || 0
                          if (!v) return null
                          return (
                            <div
                              key={`${d.day}-${s}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '4px 8px',
                                borderRadius: 999,
                                border: '1px solid rgba(255,255,255,0.10)',
                                background: 'rgba(0,0,0,0.18)',
                                color: 'rgba(255,255,255,0.78)',
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.70)' }} />
                              <span>{s}</span>
                              <span style={{ color: 'rgba(255,255,255,0.92)' }}>{v}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
