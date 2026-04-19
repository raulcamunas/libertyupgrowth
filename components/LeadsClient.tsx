'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

type LeadRow = {
  id: string
  created_at: string
  lead_key: string | null
  source: string | null
  name: string | null
  email: string | null
  phone: string | null
  status: string | null
  payload: any
}

type LeadStatus = 'new' | 'seguimiento' | 'llamar_despues' | 'no_interesa' | 'cerrado'

const STATUS_OPTIONS: Array<{ value: LeadStatus; label: string; color: 'yellow' | 'blue' | 'red' | 'green' | 'gray' }> = [
  { value: 'new', label: 'Nuevo', color: 'gray' },
  { value: 'seguimiento', label: 'Seguimiento', color: 'yellow' },
  { value: 'llamar_despues', label: 'Llamar después', color: 'blue' },
  { value: 'no_interesa', label: 'No interesa', color: 'red' },
  { value: 'cerrado', label: 'Cerrado', color: 'green' },
]

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return iso
  }
}

function normalize(v: string | null | undefined) {
  return (v || '').trim()
}

function leadTitle(l: LeadRow) {
  return normalize(l.name) || normalize(l.email) || normalize(l.phone) || l.lead_key || 'Lead'
}

function leadSubtitle(l: LeadRow) {
  const bits = [normalize(l.source), normalize(l.status)].filter(Boolean)
  return bits.join(' · ')
}

export default function LeadsClient({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(leads[0]?.id || null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [savingId, setSavingId] = useState<string | null>(null)

  const sources = useMemo(() => {
    const set = new Set<string>()
    leads.forEach((l) => {
      if (l.source) set.add(l.source)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [leads])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads
      .filter((l) => {
        if (sourceFilter !== 'all' && (l.source || '') !== sourceFilter) return false
        if (statusFilter !== 'all' && (l.status || 'new') !== statusFilter) return false
        return true
      })
      .filter((l) => {
        if (!q) return true
        const meta = `${l.name || ''} ${l.email || ''} ${l.phone || ''} ${l.source || ''} ${l.status || ''}`.toLowerCase()
        const json = JSON.stringify(l.payload || {}).toLowerCase()
        return meta.includes(q) || json.includes(q)
      })
  }, [leads, query, sourceFilter, statusFilter])

  const selected = useMemo(() => filtered.find((l) => l.id === selectedId) || null, [filtered, selectedId])

  const updateStatus = async (id: string, next: LeadStatus) => {
    setSavingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('leads').update({ status: next }).eq('id', id)
      if (error) throw error
    } finally {
      setSavingId(null)
    }
  }

  const statusBadge = (status?: string | null) => {
    const val = (status || 'new') as LeadStatus
    const found = STATUS_OPTIONS.find((s) => s.value === val) || STATUS_OPTIONS[0]
    return <span className={`leads-status leads-status-${found.color}`}>{found.label}</span>
  }

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="leads-head">
          <div>
            <div className="erp-miniapp-title">Leads</div>
            <div className="erp-miniapp-subtitle">Entradas desde Sheets, Meta, etc.</div>
          </div>

          <div className="leads-controls">
            <div className="leads-search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, email, teléfono..."
                className="leads-input"
              />
            </div>

            <div className="leads-filters">
              <label className="leads-filter">
                <span className="leads-filter-label">Estado</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
                  className="leads-select"
                >
                  <option value="all">Todos</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="leads-filter">
                <span className="leads-filter-label">Fuente</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="leads-select"
                >
                  <option value="all">Todas</option>
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="leads-grid">
          <motion.div
            className="leads-list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.length === 0 ? (
              <div className="leads-empty">Sin resultados.</div>
            ) : (
              <div className="leads-table">
                <div className="leads-thead">
                  <div className="leads-th">Fecha</div>
                  <div className="leads-th">Nombre</div>
                  <div className="leads-th">Teléfono</div>
                  <div className="leads-th">Email</div>
                  <div className="leads-th">Fuente</div>
                  <div className="leads-th">Estado</div>
                </div>

                <div className="leads-tbody">
                  {filtered.map((l, idx) => {
                    const isActive = l.id === selectedId
                    const statusValue = ((l.status || 'new') as LeadStatus) || 'new'
                    return (
                      <motion.div
                        key={l.id}
                        className={`leads-tr ${isActive ? 'is-active' : ''}`}
                        onClick={() => setSelectedId(l.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedId(l.id)
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(idx * 0.006, 0.18) }}
                      >
                        <div className="leads-td leads-td-date">{formatDate(l.created_at)}</div>
                        <div className="leads-td leads-td-name">{leadTitle(l)}</div>
                        <div className="leads-td">{l.phone || '-'}</div>
                        <div className="leads-td">{l.email || '-'}</div>
                        <div className="leads-td">{l.source || '-'}</div>
                        <div className="leads-td leads-td-status" onClick={(e) => e.stopPropagation()}>
                          <div className="leads-status-wrap">
                            {statusBadge(statusValue)}
                            <select
                              className="leads-status-select"
                              value={statusValue}
                              disabled={savingId === l.id}
                              onChange={async (e) => {
                                const next = e.target.value as LeadStatus
                                await updateStatus(l.id, next)
                              }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          <div className="leads-detail">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  className="leads-detail-card"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="leads-detail-top">
                    <div>
                      <div className="leads-detail-title">{leadTitle(selected)}</div>
                      <div className="leads-detail-subtitle">{formatDate(selected.created_at)}</div>
                    </div>
                    <button
                      className="leads-copy"
                      onClick={async () => {
                        await navigator.clipboard.writeText(JSON.stringify(selected.payload || {}, null, 2))
                      }}
                      type="button"
                    >
                      Copiar JSON
                    </button>
                  </div>

                  <div className="leads-kv">
                    <div className="leads-kv-item">
                      <div className="leads-kv-label">Email</div>
                      <div className="leads-kv-value">{selected.email || '-'}</div>
                    </div>
                    <div className="leads-kv-item">
                      <div className="leads-kv-label">Teléfono</div>
                      <div className="leads-kv-value">{selected.phone || '-'}</div>
                    </div>
                    <div className="leads-kv-item">
                      <div className="leads-kv-label">Fuente</div>
                      <div className="leads-kv-value">{selected.source || '-'}</div>
                    </div>
                    <div className="leads-kv-item">
                      <div className="leads-kv-label">Estado</div>
                      <div className="leads-kv-value">{selected.status || '-'}</div>
                    </div>
                  </div>

                  <div className="leads-json">
                    <pre>{JSON.stringify(selected.payload || {}, null, 2)}</pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="leads-detail-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="leads-empty">Selecciona un lead para ver el detalle.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
