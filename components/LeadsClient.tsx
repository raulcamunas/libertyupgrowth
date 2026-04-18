'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return leads

    return leads.filter((l) => {
      const meta = `${l.name || ''} ${l.email || ''} ${l.phone || ''} ${l.source || ''} ${l.status || ''}`.toLowerCase()
      const json = JSON.stringify(l.payload || {}).toLowerCase()
      return meta.includes(q) || json.includes(q)
    })
  }, [leads, query])

  const selected = useMemo(() => filtered.find((l) => l.id === selectedId) || null, [filtered, selectedId])

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="leads-head">
          <div>
            <div className="erp-miniapp-title">Leads</div>
            <div className="erp-miniapp-subtitle">Entradas desde Sheets, Meta, etc.</div>
          </div>

          <div className="leads-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono..."
              className="leads-input"
            />
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
              filtered.map((l, idx) => {
                const isActive = l.id === selectedId
                return (
                  <motion.button
                    key={l.id}
                    className={`leads-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(l.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.01, 0.2) }}
                    type="button"
                  >
                    <div className="leads-item-top">
                      <div className="leads-item-title">{leadTitle(l)}</div>
                      <div className="leads-item-date">{formatDate(l.created_at)}</div>
                    </div>
                    <div className="leads-item-subtitle">{leadSubtitle(l)}</div>
                    <div className="leads-item-meta">
                      {l.email ? <span className="leads-pill">{l.email}</span> : null}
                      {l.phone ? <span className="leads-pill">{l.phone}</span> : null}
                    </div>
                  </motion.button>
                )
              })
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
