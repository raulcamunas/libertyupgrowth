'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

type ColumnKey = 'date' | 'status' | 'name' | 'phone' | 'email' | 'notes' | 'extra'

const COLUMN_DEFAULT_WIDTH: Record<ColumnKey, number> = {
  date: 150,
  status: 200,
  name: 260,
  phone: 180,
  email: 280,
  notes: 520,
  extra: 140,
}

const COL_STORAGE_KEY = 'leads_col_widths_v1'

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

function notesToEntries(raw: string): Array<{ ts: string; text: string }> {
  const cleaned = (raw || '').trim()
  if (!cleaned) return []
  const blocks = cleaned
    .split(/\n\s*\n/g)
    .map((b) => b.trim())
    .filter(Boolean)

  const out: Array<{ ts: string; text: string }> = []
  for (const b of blocks) {
    const m = b.match(/^\[([^\]]+)\]\s*[\n\r]*([\s\S]*)$/)
    if (m) {
      out.push({ ts: m[1].trim(), text: (m[2] || '').trim() })
    } else {
      out.push({ ts: '', text: b })
    }
  }
  return out
}

function entriesToNotes(entries: Array<{ ts: string; text: string }>): string {
  return entries
    .map((e) => {
      const text = (e.text || '').trimEnd()
      if (!text && !e.ts) return ''
      if (!e.ts) return text
      return `[${e.ts}]\n${text}`.trimEnd()
    })
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

function nowStampEs() {
  try {
    const d = new Date()
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return new Date().toISOString()
  }
}

export default function LeadsClient({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [showJson, setShowJson] = useState(false)
  const [statusOverrideById, setStatusOverrideById] = useState<Record<string, LeadStatus>>({})
  const [statusMenuOpenForId, setStatusMenuOpenForId] = useState<string | null>(null)
  const [statusMenuPos, setStatusMenuPos] = useState<{ id: string; top: number; left: number } | null>(null)
  const [notesOverrideById, setNotesOverrideById] = useState<Record<string, string>>({})

  const [baseStatusById, setBaseStatusById] = useState<Record<string, LeadStatus>>({})
  const [baseNotesById, setBaseNotesById] = useState<Record<string, string>>({})

  const [localLeads, setLocalLeads] = useState<LeadRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [addCreatedAt, setAddCreatedAt] = useState('')
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addPhone, setAddPhone] = useState('')
  const [addNotes, setAddNotes] = useState('')
  const [addStatus, setAddStatus] = useState<LeadStatus>('new')
  const [addError, setAddError] = useState('')

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string>('')

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>('')
  const [colWidths, setColWidths] = useState<Record<ColumnKey, number>>(COLUMN_DEFAULT_WIDTH)
  const resizingRef = useRef<{
    key: ColumnKey
    startX: number
    startWidth: number
  } | null>(null)

  const notesRefById = useRef<Record<string, HTMLTextAreaElement | null>>({})

  useEffect(() => {
    setBaseStatusById((prev) => {
      const next = { ...prev }
      for (const l of leads) {
        if (!next[l.id]) next[l.id] = ((l.status || 'new') as LeadStatus) || 'new'
      }
      return next
    })
    setBaseNotesById((prev) => {
      const next = { ...prev }
      for (const l of leads) {
        if (!Object.prototype.hasOwnProperty.call(next, l.id)) next[l.id] = l.notes || ''
      }
      return next
    })
  }, [leads])

  useEffect(() => {
    const onDown = () => {
      setStatusMenuOpenForId(null)
      setStatusMenuPos(null)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  const autosizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COL_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<Record<ColumnKey, number>>
      setColWidths((prev) => ({ ...prev, ...parsed }))
    } catch {
      // ignore
    }
  }, [])

  const sources = useMemo(() => {
    const set = new Set<string>()
    ;[...localLeads, ...leads].forEach((l) => {
      if (l.source) set.add(l.source)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [leads, localLeads])

  const allLeads = useMemo(() => {
    const map = new Map<string, LeadRow>()
    for (const l of leads) map.set(l.id, l)
    for (const l of localLeads) map.set(l.id, l)
    return Array.from(map.values())
  }, [leads, localLeads])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allLeads
      .filter((l) => {
        if (sourceFilter !== 'all' && (l.source || '') !== sourceFilter) return false
        const currentStatus = statusOverrideById[l.id] || baseStatusById[l.id] || ((l.status || 'new') as LeadStatus)
        if (statusFilter !== 'all' && currentStatus !== statusFilter) return false
        return true
      })
      .filter((l) => {
        if (!q) return true
        const meta = `${l.name || ''} ${l.email || ''} ${l.phone || ''} ${l.source || ''} ${l.status || ''}`.toLowerCase()
        const json = JSON.stringify(l.payload || {}).toLowerCase()
        return meta.includes(q) || json.includes(q)
      })
      .slice()
      .sort((a, b) => {
        const ta = new Date(a.created_at).getTime()
        const tb = new Date(b.created_at).getTime()
        return tb - ta
      })
  }, [allLeads, query, sourceFilter, statusFilter, statusOverrideById, baseStatusById])

  useEffect(() => {
    Object.values(notesRefById.current).forEach((el) => {
      if (el) autosizeTextarea(el)
    })
  }, [notesOverrideById, allLeads.length])

  const selected = useMemo(() => filtered.find((l) => l.id === drawerLeadId) || null, [filtered, drawerLeadId])

  const selectedJson = useMemo(() => {
    if (!selected) return ''
    return JSON.stringify(selected.payload || {}, null, 2)
  }, [selected])

  const isDirty = useMemo(() => {
    return Object.keys(statusOverrideById).length > 0 || Object.keys(notesOverrideById).length > 0
  }, [notesOverrideById, statusOverrideById])

  const saveAll = async () => {
    setSaveError('')
    if (!isDirty) {
      try {
        window.localStorage.setItem(COL_STORAGE_KEY, JSON.stringify(colWidths))
      } catch {
        // ignore
      }
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()

      const ids = new Set<string>()
      Object.keys(statusOverrideById).forEach((id) => ids.add(id))
      Object.keys(notesOverrideById).forEach((id) => ids.add(id))

      const ops = Array.from(ids).map(async (id) => {
        const update: { status?: LeadStatus; notes?: string } = {}
        if (statusOverrideById[id]) update.status = statusOverrideById[id]
        if (Object.prototype.hasOwnProperty.call(notesOverrideById, id)) update.notes = notesOverrideById[id]
        if (Object.keys(update).length === 0) return
        const { error } = await supabase.from('leads').update(update).eq('id', id)
        if (error) throw error
      })

      await Promise.all(ops)

      setBaseStatusById((prev) => {
        const next = { ...prev }
        for (const [id, st] of Object.entries(statusOverrideById)) next[id] = st
        return next
      })

      setBaseNotesById((prev) => {
        const next = { ...prev }
        for (const [id, notes] of Object.entries(notesOverrideById)) next[id] = notes
        return next
      })

      setStatusOverrideById({})
      setNotesOverrideById({})

      try {
        window.localStorage.setItem(COL_STORAGE_KEY, JSON.stringify(colWidths))
      } catch {
        // ignore
      }
    } catch (e: any) {
      setSaveError(e?.message || 'No se ha podido guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const createManualLead = async () => {
    setAddError('')
    try {
      if (!addName.trim() && !addEmail.trim() && !addPhone.trim()) {
        setAddError('Rellena al menos nombre, email o teléfono.')
        return
      }

      const supabase = createClient()
      const createdAt = addCreatedAt ? new Date(addCreatedAt).toISOString() : new Date().toISOString()
      const payload = {
        source: 'Manual',
        created_time: createdAt,
        full_name: addName.trim() || null,
        email: addEmail.trim() || null,
        phone_number: addPhone.trim() || null,
        notes: addNotes.trim() || null,
        status: addStatus,
      }

      const { data, error } = await supabase
        .from('leads')
        .insert({
          created_at: createdAt,
          source: 'Manual',
          name: addName.trim() || null,
          email: addEmail.trim() || null,
          phone: addPhone.trim() || null,
          status: addStatus,
          notes: addNotes.trim() || '',
          payload,
        })
        .select('*')
        .single()

      if (error) throw error

      const row = data as LeadRow
      setLocalLeads((prev) => [row, ...prev])
      setBaseStatusById((prev) => ({ ...prev, [row.id]: (row.status as LeadStatus) || addStatus }))
      setBaseNotesById((prev) => ({ ...prev, [row.id]: row.notes || addNotes.trim() }))

      setAddOpen(false)
      setAddCreatedAt('')
      setAddName('')
      setAddEmail('')
      setAddPhone('')
      setAddNotes('')
      setAddStatus('new')
    } catch (e: any) {
      setAddError(e?.message || 'No se ha podido crear el lead')
    }
  }

  const deleteLead = async (id: string) => {
    setDeleteError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('leads').delete().eq('id', id)
      if (error) throw error

      setLocalLeads((prev: LeadRow[]) => prev.filter((l) => l.id !== id))
      setStatusOverrideById((prev: Record<string, LeadStatus>) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setNotesOverrideById((prev: Record<string, string>) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setBaseStatusById((prev: Record<string, LeadStatus>) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setBaseNotesById((prev: Record<string, string>) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      if (drawerLeadId === id) setDrawerLeadId(null)
      setDeleteId(null)
    } catch (e: any) {
      setDeleteError(e?.message || 'No se ha podido borrar')
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

  const gridTemplate = useMemo(() => {
    const parts = [
      `${colWidths.date}px`,
      `${colWidths.status}px`,
      `${colWidths.name}px`,
      `${colWidths.phone}px`,
      `${colWidths.email}px`,
      `${colWidths.notes}px`,
      `${colWidths.extra}px`,
    ]
    return parts.join(' ')
  }, [colWidths])

  const resizeStops = useMemo(() => {
    const stops: Array<{ key: ColumnKey; left: number }> = []
    let acc = 0
    ;(['date', 'status', 'name', 'phone', 'email', 'notes'] as ColumnKey[]).forEach((k) => {
      acc += colWidths[k]
      stops.push({ key: k, left: acc })
    })
    return stops
  }, [colWidths])

  const startResize = (key: ColumnKey, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStatusMenuOpenForId(null)
    resizingRef.current = {
      key,
      startX: e.clientX,
      startWidth: colWidths[key],
    }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cur = resizingRef.current
      if (!cur) return
      const dx = e.clientX - cur.startX
      setColWidths((prev) => ({
        ...prev,
        [cur.key]: Math.max(120, cur.startWidth + dx),
      }))
    }
    const onUp = () => {
      resizingRef.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

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

            <button className="leads-add-btn" type="button" onClick={() => setAddOpen(true)}>
              Añadir lead
            </button>
          </div>
        </div>

        <div className="leads-savebar">
          <div className="leads-savebar-left">
            {isDirty ? <span className="leads-unsaved">Cambios sin guardar</span> : <span className="leads-saved">Todo guardado</span>}
            {saveError ? <span className="leads-save-error">{saveError}</span> : null}
          </div>
          <button className="leads-save-btn" type="button" onClick={saveAll} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
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
                <div className="leads-thead" style={{ gridTemplateColumns: gridTemplate }}>
                  <div className="leads-th">Fecha</div>
                  <div className="leads-th">Estado</div>
                  <div className="leads-th">Nombre</div>
                  <div className="leads-th">Teléfono</div>
                  <div className="leads-th">Email</div>
                  <div className="leads-th">Notas</div>
                  <div className="leads-th">Datos extra</div>

                  {resizeStops.map((s) => (
                    <div
                      key={s.key}
                      className="leads-resize"
                      style={{ left: `${s.left - 5}px` }}
                      onMouseDown={(e) => startResize(s.key, e)}
                    />
                  ))}
                </div>

                <div className="leads-tbody">
                  {filtered.map((l, idx) => {
                    const statusValue = statusOverrideById[l.id] || baseStatusById[l.id] || (((l.status || 'new') as LeadStatus) || 'new')
                    const statusColor = statusColorByValue(statusValue)
                    const notesValue = notesOverrideById[l.id] ?? baseNotesById[l.id] ?? (l.notes || '')
                    const entries = notesToEntries(notesValue)
                    return (
                      <motion.div
                        key={l.id}
                        className={`leads-tr leads-row-${statusColor}`}
                        style={{ gridTemplateColumns: gridTemplate }}
                        onClick={() => {
                          setSelectedId(l.id)
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
                        <div className="leads-td leads-td-status" onClick={(e) => e.stopPropagation()}>
                          <div className="leads-status-wrap">
                            <button
                              type="button"
                              className="leads-status-btn"
                              disabled={isSaving}
                              onPointerDown={(e) => {
                                e.stopPropagation()
                                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                                const menuWidth = 210
                                const left = Math.min(window.innerWidth - menuWidth - 12, Math.max(12, rect.left))
                                const top = rect.bottom + 8
                                setStatusMenuPos({ id: l.id, top, left })
                                setStatusMenuOpenForId((cur) => (cur === l.id ? null : l.id))
                              }}
                            >
                              {statusBadge(statusValue)}
                            </button>
                          </div>
                        </div>

                        <div className="leads-td leads-td-name">{leadTitle(l)}</div>
                        <div className="leads-td">{l.phone || '-'}</div>
                        <div className="leads-td">{l.email || '-'}</div>

                        <div className="leads-td leads-td-notes" onClick={(e) => e.stopPropagation()}>
                          <div className="leads-notes-entries">
                            {entries.length === 0 ? <div className="leads-notes-empty">Sin comentarios</div> : null}
                            {entries.map((en, i) => (
                              <div key={`${l.id}-${i}`} className="leads-note-entry">
                                {en.ts ? <div className="leads-note-ts">{en.ts}</div> : null}
                                <textarea
                                  className="leads-note-textarea"
                                  value={en.text}
                                  placeholder="Escribe..."
                                  rows={2}
                                  onChange={(e) => {
                                    const next = entries.slice()
                                    next[i] = { ...next[i], text: e.target.value }
                                    setNotesOverrideById((prev) => ({ ...prev, [l.id]: entriesToNotes(next) }))
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className="leads-note-add-btn"
                            onClick={() => {
                              const stamp = nowStampEs()
                              const next = entries.slice()
                              next.push({ ts: stamp, text: '' })
                              setNotesOverrideById((prev) => ({ ...prev, [l.id]: entriesToNotes(next) }))
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div className="leads-td leads-td-extra" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="leads-extra-btn"
                            onClick={() => {
                              setDrawerLeadId(l.id)
                              setShowJson(false)
                            }}
                          >
                            Datos extra
                          </button>
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
          {statusMenuOpenForId && statusMenuPos ? (
            <motion.div
              className="leads-status-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onPointerDown={() => {
                setStatusMenuOpenForId(null)
                setStatusMenuPos(null)
              }}
            >
              <motion.div
                className="leads-status-menu"
                style={{ top: statusMenuPos.top, left: statusMenuPos.left }}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`leads-status-menu-item ${opt.value === (statusOverrideById[statusMenuPos.id] || 'new') ? 'is-active' : ''}`}
                    onClick={() => {
                      setStatusOverrideById((prev) => ({ ...prev, [statusMenuPos.id]: opt.value }))
                      setStatusMenuOpenForId(null)
                      setStatusMenuPos(null)
                    }}
                  >
                    <span className={`leads-status-dot leads-status-dot-${opt.color}`} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {deleteId ? (
            <motion.div
              className="leads-add-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              onPointerDown={() => setDeleteId(null)}
            >
              <motion.div
                className="leads-add-modal"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="leads-add-title">Borrar lead</div>
                <div className="leads-add-error" style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)', color: 'rgba(255,255,255,0.82)' }}>
                  Esta acción no se puede deshacer.
                </div>
                {deleteError ? <div className="leads-add-error">{deleteError}</div> : null}

                <div className="leads-add-actions">
                  <button className="leads-add-cancel" type="button" onClick={() => setDeleteId(null)}>
                    Cancelar
                  </button>
                  <button
                    className="leads-add-create"
                    type="button"
                    onClick={() => deleteLead(deleteId)}
                  >
                    Borrar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {selected ? (
            <motion.div
              className="leads-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setDrawerLeadId(null)}
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
                      <button className="leads-drawer-close" onClick={() => setDrawerLeadId(null)} type="button">
                        Cerrar
                      </button>
                      <button
                        className="leads-drawer-delete"
                        onClick={() => setDeleteId(selected.id)}
                        type="button"
                      >
                        Borrar
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

      <AnimatePresence>
        {addOpen ? (
          <motion.div
            className="leads-add-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onPointerDown={() => setAddOpen(false)}
          >
            <motion.div
              className="leads-add-modal"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="leads-add-title">Añadir lead</div>
              {addError ? <div className="leads-add-error">{addError}</div> : null}

              <div className="leads-add-grid">
                <label className="leads-add-field">
                  <div className="leads-add-label">Fecha</div>
                  <input
                    className="leads-add-input"
                    type="datetime-local"
                    value={addCreatedAt}
                    onChange={(e) => setAddCreatedAt(e.target.value)}
                  />
                </label>
                <label className="leads-add-field">
                  <div className="leads-add-label">Nombre</div>
                  <input className="leads-add-input" value={addName} onChange={(e) => setAddName(e.target.value)} />
                </label>
                <label className="leads-add-field">
                  <div className="leads-add-label">Email</div>
                  <input className="leads-add-input" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} />
                </label>
                <label className="leads-add-field">
                  <div className="leads-add-label">Teléfono</div>
                  <input className="leads-add-input" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} />
                </label>
                <label className="leads-add-field">
                  <div className="leads-add-label">Estado</div>
                  <select className="leads-add-input" value={addStatus} onChange={(e) => setAddStatus(e.target.value as LeadStatus)}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="leads-add-field leads-add-field-full">
                  <div className="leads-add-label">Notas</div>
                  <textarea className="leads-add-textarea" value={addNotes} onChange={(e) => setAddNotes(e.target.value)} rows={4} />
                </label>
              </div>

              <div className="leads-add-actions">
                <button className="leads-add-cancel" type="button" onClick={() => setAddOpen(false)}>
                  Cancelar
                </button>
                <button className="leads-add-create" type="button" onClick={createManualLead}>
                  Crear
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
