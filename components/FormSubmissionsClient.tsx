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

function pickFirstNumber(payload: any, keys: string[]): string {
  for (const k of keys) {
    const v = payload?.[k]
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
    if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return v.trim()
  }
  return ''
}

function pickFirstBoolean(payload: any, keys: string[]): string {
  for (const k of keys) {
    const v = payload?.[k]
    if (typeof v === 'boolean') return v ? 'Sí' : 'No'
    if (typeof v === 'string') {
      const t = v.trim().toLowerCase()
      if (['si', 'sí', 'true', '1'].includes(t)) return 'Sí'
      if (['no', 'false', '0'].includes(t)) return 'No'
    }
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
  const subtitle = [sector, name || email].filter(Boolean).join(' · ')

  return { title, subtitle }
}

function getDetailSections(payload: any) {
  const business = pickFirst(payload, ['nombreNegocio', 'nombreCentro', 'empresa', 'businessName'])
  const sector = pickFirst(payload, ['tipoNegocio', 'sector', 'businessType'])
  const employees = pickFirst(payload, ['empleados']) || pickFirstNumber(payload, ['numEmpleados', 'employees', 'employeeCount'])
  const city = pickFirst(payload, ['ciudad', 'city'])

  const name = pickFirst(payload, ['nombre', 'nombreCompleto', 'fullName'])
  const phone = pickFirst(payload, ['telefono', 'tel', 'phone', 'movil', 'mobile'])
  const email = pickFirst(payload, ['email', 'correo'])

  const usaAgendaDigital = pickFirstBoolean(payload, ['usaAgendaDigital', 'isSeller'])
  const availability = pickFirst(payload, ['disponibilidad', 'availability'])

  const pain = pickFirst(payload, ['painPoint', 'dolor', 'problema', 'pain_point'])
  const current = pickFirst(payload, ['situacionActual', 'currentSituation', 'current_situation'])
  const objective = pickFirst(payload, ['objetivo', 'objective', 'goal'])

  const rows = (items: Array<{ label: string; value: string }>) => items.filter((i) => i.value)

  return [
    {
      title: 'Negocio',
      items: rows([
        { label: 'Nombre', value: business },
        { label: 'Sector', value: sector },
        { label: 'Empleados', value: employees },
        { label: 'Ciudad', value: city },
      ]),
    },
    {
      title: 'Contacto',
      items: rows([
        { label: 'Nombre', value: name },
        { label: 'Teléfono', value: phone },
        { label: 'Email', value: email },
      ]),
    },
    {
      title: 'Operativa',
      items: rows([
        { label: 'Usa agenda digital', value: usaAgendaDigital },
        { label: 'Disponibilidad', value: availability },
      ]),
    },
    {
      title: 'Contexto',
      items: rows([
        { label: 'Punto de dolor', value: pain },
        { label: 'Situación actual', value: current },
        { label: 'Objetivo', value: objective },
      ]),
    },
  ].filter((s) => s.items.length > 0)
}

function formatCopyText(submission: FormSubmissionRow) {
  const payload = submission.payload || {}
  const { title, subtitle } = getSummary(payload)
  const sections = getDetailSections(payload)
  const lines: string[] = []
  lines.push(`${title}${subtitle ? ` — ${subtitle}` : ''}`)
  lines.push(`Fecha: ${formatDate(submission.created_at)}`)
  if (submission.source) lines.push(`Source: ${submission.source}`)
  for (const sec of sections) {
    lines.push('')
    lines.push(`${sec.title}:`)
    for (const it of sec.items) {
      lines.push(`- ${it.label}: ${it.value}`)
    }
  }
  return lines.join('\n')
}

export default function FormSubmissionsClient({ submissions }: { submissions: FormSubmissionRow[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return submissions

    return submissions.filter((s) => {
      const str = JSON.stringify(s.payload || {}).toLowerCase()
      const meta = `${s.source || ''}`.toLowerCase()
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
                        await navigator.clipboard.writeText(formatCopyText(selected))
                      }}
                      type="button"
                    >
                      Copiar info
                    </button>
                  </div>

                  <div className="formsub-sections">
                    {getDetailSections(selected.payload).map((sec) => (
                      <div key={sec.title} className="formsub-section">
                        <div className="formsub-section-title">{sec.title}</div>
                        <div className="formsub-section-rows">
                          {sec.items.map((it) => (
                            <div key={`${sec.title}-${it.label}`} className="formsub-row">
                              <div className="formsub-row-label">{it.label}</div>
                              <div className="formsub-row-value">{it.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
