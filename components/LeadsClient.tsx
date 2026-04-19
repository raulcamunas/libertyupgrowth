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
  adset_name?: string | null
  pain_point?: string | null
  current_situation?: string | null
  notes?: string | null
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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [statusOverrideById, setStatusOverrideById] = useState<Record<string, LeadStatus>>({})
  const [statusMenuOpenForId, setStatusMenuOpenForId] = useState<string | null>(null)
  const [notesOverrideById, setNotesOverrideById] = useState<Record<string, string>>({})
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null)

  const updateNotes = async (id: string, next: string) => {
    setSavingNotesId(id)
    setNotesOverrideById((prev: Record<string, string>) => ({ ...prev, [id]: next }))
    try {
      const supabase = createClient()
      const { error } = await supabase.from('leads').update({ notes: next }).eq('id', id)
      if (error) throw error
    } catch {
      setNotesOverrideById((prev: Record<string, string>) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    } finally {
      setSavingNotesId(null)
    }
  }

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
        const currentStatus = statusOverrideById[l.id] || ((l.status || 'new') as LeadStatus)
        if (statusFilter !== 'all' && currentStatus !== statusFilter) return false
        return true
      })
      .filter((l) => {
        if (!q) return true
        const meta = `${l.name || ''} ${l.email || ''} ${l.phone || ''} ${l.source || ''} ${l.status || ''}`.toLowerCase()
        const json = JSON.stringify(l.payload || {}).toLowerCase()
        return meta.includes(q) || json.includes(q)
      })
  }, [leads, query, sourceFilter, statusFilter, statusOverrideById])

  const selected = useMemo(() => filtered.find((l) => l.id === selectedId) || null, [filtered, selectedId])

  const selectedJson = useMemo(() => {
    if (!selected) return ''
    return JSON.stringify(selected.payload || {}, null, 2)
  }, [selected])

  const updateStatus = async (id: string, next: LeadStatus) => {
    setSavingId(id)
    setStatusOverrideById((prev) => ({ ...prev, [id]: next }))
    try {
      const supabase = createClient()
      const { error } = await supabase.from('leads').update({ status: next }).eq('id', id)
      if (error) throw error
    } catch {
      setStatusOverrideById((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    } finally {
      setSavingId(null)
    }
  }

  const statusBadge = (status?: string | null) => {
    const val = (status || 'new') as LeadStatus
    const found = STATUS_OPTIONS.find((s) => s.value === val) || STATUS_OPTIONS[0]
    return <span className={`leads-status leads-status-${found.color}`}>{found.label}</span>
  }

  const statusColorByValue = (status?: string | null) => {
    const val = (status || 'new') as LeadStatus
    const found = STATUS_OPTIONS.find((s) => s.value === val) || STATUS_OPTIONS[0]
    return found.color
  }

  return (
    <div className="erp-miniapp leads-full">
      <div className="erp-miniapp-card leads-card">
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

        <motion.div
          className="leads-list"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.length === 0 ? (
            <div className="leads-empty">Sin resultados.</div>
          ) : (
            <div className="leads-table-scroll">
              <div className="leads-table">
                <div className="leads-thead">
                  <div className="leads-th">Fecha</div>
                  <div className="leads-th">Nombre</div>
                  <div className="leads-th">Teléfono</div>
                  <div className="leads-th">Email</div>
                  <div className="leads-th">Fuente</div>
                  <div className="leads-th">Adset</div>
                  <div className="leads-th">Dolor</div>
                  <div className="leads-th">Situación</div>
                  <div className="leads-th">Notas</div>
                  <div className="leads-th">Estado</div>
                </div>

                <div className="leads-tbody">
                  {filtered.map((l, idx) => {
                    const isActive = l.id === selectedId
                    const statusValue = statusOverrideById[l.id] || (((l.status || 'new') as LeadStatus) || 'new')
                    const statusColor = statusColorByValue(statusValue)
                    const notesValue = notesOverrideById[l.id] ?? (l.notes || '')
                    return (
                      <motion.div
                        key={l.id}
                        className={`leads-tr leads-row-${statusColor} ${isActive ? 'is-active' : ''}`}
                        onClick={() => {
                          setSelectedId(l.id)
                          setShowJson(false)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedId(l.id)
                            setShowJson(false)
                          }
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(idx * 0.004, 0.18) }}
                      >
                        <div className="leads-td leads-td-date">{formatDate(l.created_at)}</div>
                        <div className="leads-td leads-td-name">{leadTitle(l)}</div>
                        <div className="leads-td">{l.phone || '-'}</div>
                        <div className="leads-td">{l.email || '-'}</div>
                        <div className="leads-td">{l.source || '-'}</div>
                        <div className="leads-td">{l.adset_name || '-'}</div>
                        <div className="leads-td">{l.pain_point || '-'}</div>
                        <div className="leads-td">{l.current_situation || '-'}</div>
                        <div className="leads-td leads-td-notes" onClick={(e) => e.stopPropagation()}>
                          <input
                            className="leads-notes-input"
                            value={notesValue}
                            placeholder="Escribe notas..."
                            onChange={(e) => setNotesOverrideById((prev) => ({ ...prev, [l.id]: e.target.value }))}
                            onBlur={async (e) => {
                              await updateNotes(l.id, e.target.value)
                            }}
                            disabled={savingNotesId === l.id}
                          />
                        </div>
                        <div className="leads-td leads-td-status" onClick={(e) => e.stopPropagation()}>
                          <div className="leads-status-wrap">
                            <button
                              type="button"
                              className="leads-status-btn"
                              disabled={savingId === l.id}
                              onClick={() => setStatusMenuOpenForId((cur) => (cur === l.id ? null : l.id))}
                            >
                              {statusBadge(statusValue)}
                            </button>

                            <AnimatePresence>
                              {statusMenuOpenForId === l.id ? (
                                <motion.div
                                  className="leads-status-menu"
                                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                  transition={{ duration: 0.14 }}
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      className={`leads-status-menu-item ${opt.value === statusValue ? 'is-active' : ''}`}
                                      onClick={async () => {
                                        await updateStatus(l.id, opt.value)
                                        setStatusMenuOpenForId(null)
                                      }}
                                    >
                                      <span className={`leads-status-dot leads-status-dot-${opt.color}`} />
                                      <span>{opt.label}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {selected ? (
            <motion.div
              className="leads-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                className="leads-drawer"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="leads-detail-card">
                  <div className="leads-detail-top">
                    <div>
                      <div className="leads-detail-title">{leadTitle(selected)}</div>
                      <div className="leads-detail-subtitle">{formatDate(selected.created_at)}</div>
                    </div>
                    <div className="leads-detail-actions">
                      <button className="leads-json-toggle" onClick={() => setShowJson((v) => !v)} type="button">
                        {showJson ? 'Ocultar JSON' : 'Ver JSON'}
                      </button>
                      <button
                        className="leads-copy"
                        onClick={async () => {
                          await navigator.clipboard.writeText(selectedJson)
                        }}
                        type="button"
                      >
                        Copiar JSON
                      </button>
                      <button className="leads-drawer-close" onClick={() => setSelectedId(null)} type="button">
                        Cerrar
                      </button>
                    </div>
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

                  <AnimatePresence>
                    {showJson ? (
                      <motion.div
                        className="leads-json"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <pre>{selectedJson}</pre>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
