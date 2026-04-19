'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FormSubmissionRow = {
  id: string
  created_at: string
  source: string | null
  ip: string | null
  user_agent: string | null
  payload: any
}

function pickFirst(payload: any, keys: string[]): string {
  for (const k of keys) {
    const v = payload?.[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
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

function getSummary(payload: any) {
  const business = pickFirst(payload, ['nombreNegocio', 'nombreCentro', 'empresa', 'businessName'])
  const name = pickFirst(payload, ['nombre', 'nombreCompleto', 'fullName'])
  const email = pickFirst(payload, ['email', 'correo'])
  const sector = pickFirst(payload, ['tipoNegocio', 'sector', 'businessType'])

  const title = business || name || email || 'Envío'
  const subtitle = [sector, email].filter(Boolean).join(' · ')

  return { title, subtitle }
}

export default function FormSubmissionsClient({ submissions }: { submissions: FormSubmissionRow[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return submissions

    return submissions.filter((s) => {
      const str = JSON.stringify(s.payload || {}).toLowerCase()
      const meta = `${s.source || ''} ${s.ip || ''} ${s.user_agent || ''}`.toLowerCase()
      return str.includes(q) || meta.includes(q)
    })
  }, [query, submissions])

  const selected = useMemo(() => filtered.find((s) => s.id === selectedId) || null, [filtered, selectedId])

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="formsub-head">
          <div>
            <div className="erp-miniapp-title">Formularios</div>
            <div className="erp-miniapp-subtitle">Envíos capturados del onboarding</div>
          </div>

          <div className="formsub-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cualquier campo..."
              className="formsub-input"
            />
          </div>
        </div>

        <div className="formsub-grid">
          <motion.div
            className="formsub-list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.length === 0 ? (
              <div className="formsub-empty">Sin resultados.</div>
            ) : (
              filtered.map((s, idx) => {
                const { title, subtitle } = getSummary(s.payload)
                const isActive = s.id === selectedId

                return (
                  <motion.button
                    key={s.id}
                    className={`formsub-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(s.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.01, 0.2) }}
                  >
                    <div className="formsub-item-top">
                      <div className="formsub-item-title">{title}</div>
                      <div className="formsub-item-date">{formatDate(s.created_at)}</div>
                    </div>
                    {subtitle ? <div className="formsub-item-subtitle">{subtitle}</div> : null}
                    <div className="formsub-item-meta">
                      {s.source ? <span className="formsub-pill">{s.source}</span> : null}
                      {s.ip ? <span className="formsub-pill">{s.ip}</span> : null}
                    </div>
                  </motion.button>
                )
              })
            )}
          </motion.div>

          <div className="formsub-detail">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  className="formsub-detail-card"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="formsub-detail-top">
                    <div>
                      <div className="formsub-detail-title">{getSummary(selected.payload).title}</div>
                      <div className="formsub-detail-subtitle">{formatDate(selected.created_at)}</div>
                    </div>
                    <button
                      className="formsub-copy"
                      onClick={async () => {
                        await navigator.clipboard.writeText(JSON.stringify(selected.payload || {}, null, 2))
                      }}
                      type="button"
                    >
                      Copiar JSON
                    </button>
                  </div>

                  <div className="formsub-json">
                    <pre>{JSON.stringify(selected.payload || {}, null, 2)}</pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="formsub-detail-card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="formsub-empty">Selecciona un envío para ver el detalle.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
