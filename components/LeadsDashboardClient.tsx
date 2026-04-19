'use client'

import { useEffect, useMemo, useState } from 'react'

type DayPoint = {
  day: string
  total: number
  bySource: Record<string, number>
}

function ymd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function monthRange(monthValue: string) {
  const m = /^\d{4}-\d{2}$/.exec(monthValue)
  if (!m) return null
  const [y, mo] = monthValue.split('-').map((x) => Number(x))
  if (!y || !mo) return null
  const from = new Date(Date.UTC(y, mo - 1, 1, 0, 0, 0, 0))
  const to = new Date(Date.UTC(y, mo, 0, 0, 0, 0, 0))
  return { from: ymd(from), to: ymd(to) }
}

export default function LeadsDashboardClient() {
  const [days, setDays] = useState<DayPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [month, setMonth] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [hover, setHover] = useState<{ x: number; y: number; day: string; total: number; bySource: Record<string, number> } | null>(null)

  const maxTotal = useMemo(() => Math.max(1, ...days.map((d) => d.total)), [days])

  const sources = useMemo(() => {
    const set = new Set<string>()
    for (const d of days) {
      Object.keys(d.bySource || {}).forEach((s) => set.add(s))
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [days])

  useEffect(() => {
    const now = new Date()
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    setMonth(defaultMonth)
    const r = monthRange(defaultMonth)
    if (r) {
      setFrom(r.from)
      setTo(r.to)
    }
  }, [])

  const load = async (nextFrom: string, nextTo: string) => {
    setError('')
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (nextFrom) qs.set('from', nextFrom)
      if (nextTo) qs.set('to', nextTo)
      const url = `/api/erp/leads-metrics${qs.toString() ? `?${qs.toString()}` : ''}`
      const res = await fetch(url, { method: 'GET' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido cargar')
      setDays((data?.days || []) as DayPoint[])
    } catch (e: any) {
      setError(e?.message || 'No se ha podido cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!from || !to) return
    void load(from, to)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to])

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="erp-miniapp-title">Dashboard</div>
        <div className="erp-miniapp-subtitle">Leads por día</div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.65)' }}>Mes</div>
            <input
              type="month"
              value={month}
              onChange={(e) => {
                const v = e.target.value
                setMonth(v)
                const r = monthRange(v)
                if (r) {
                  setFrom(r.from)
                  setTo(r.to)
                }
              }}
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.86)',
                fontWeight: 850,
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.65)' }}>Desde</div>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.86)',
                fontWeight: 850,
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.65)' }}>Hasta</div>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.86)',
                fontWeight: 850,
              }}
            />
          </div>
        </div>

        {error ? <div className="leads-add-error">{error}</div> : null}

        {loading ? (
          <div className="erp-miniapp-empty">Cargando...</div>
        ) : days.length === 0 ? (
          <div className="erp-miniapp-empty">No hay datos.</div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                position: 'relative',
                height: 220,
                padding: 14,
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.10)',
                background:
                  'radial-gradient(900px 240px at 30% 0%, rgba(0,181,255,0.18), rgba(0,0,0,0) 60%), rgba(0,0,0,0.18)',
                overflowX: 'auto',
              }}
              aria-label="Gráfica de leads por día"
              onMouseLeave={() => setHover(null)}
            >
              <div style={{ position: 'absolute', left: 14, right: 14, bottom: 42, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 170, paddingBottom: 38 }}>
                {days.map((d) => {
                  const h = Math.round((d.total / maxTotal) * 150)
                  const label = d.day.slice(8)
                  return (
                    <div key={d.day} style={{ width: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                      <div
                        onMouseMove={(e) => {
                          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                          setHover({
                            x: rect.left + rect.width / 2 + window.scrollX,
                            y: rect.top + window.scrollY,
                            day: d.day,
                            total: d.total,
                            bySource: d.bySource || {},
                          })
                        }}
                        style={{
                          width: 16,
                          height: Math.max(2, h),
                          borderRadius: 10,
                          background:
                            d.total === 0
                              ? 'rgba(255,255,255,0.08)'
                              : 'linear-gradient(180deg, rgba(0,181,255,0.95), rgba(0,120,255,0.35))',
                          border: d.total === 0 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,181,255,0.28)',
                          transition: 'transform 0.12s ease, filter 0.12s ease',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                          ;(e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.08)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0px)'
                          ;(e.currentTarget as HTMLDivElement).style.filter = 'none'
                        }}
                      />
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>{label}</div>
                    </div>
                  )
                })}
              </div>

              {hover ? (
                <div
                  style={{
                    position: 'fixed',
                    top: hover.y - 12,
                    left: hover.x + 12,
                    zIndex: 50,
                    padding: 10,
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(0,0,0,0.88)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    minWidth: 200,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.95)' }}>{hover.day}</div>
                  <div style={{ marginTop: 2, fontWeight: 900, color: 'rgba(0,181,255,0.95)' }}>{hover.total} leads</div>
                  <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                    {Object.entries(hover.bySource)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}>
                          <div style={{ color: 'rgba(255,255,255,0.70)' }}>{k}</div>
                          <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{v}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
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
