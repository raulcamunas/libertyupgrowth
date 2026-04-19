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

  const title = business || name || sector || email || 'Formulario'
  const subtitle = [sector, name || email].filter(Boolean).join(' · ')

  return { title, subtitle }
}

function formatValue(v: any): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'boolean') return v ? 'Sí' : 'No'
  if (Array.isArray(v)) {
    const names = v
      .map((x) => {
        if (typeof x === 'string') return x.trim()
        if (typeof x === 'object' && x && typeof x.name === 'string') return x.name.trim()
        return ''
      })
      .filter(Boolean)
    if (names.length) return names.join(', ')
    return ''
  }
  if (typeof v === 'object') return ''
  return ''
}

const FIELD_LABELS: Record<string, string> = {
  nombre: 'Nombre',
  nombreNegocio: 'Nombre del negocio',
  businessType: 'Tipo de negocio',

  sector: 'Sector',
  direccionCompleta: 'Dirección completa',
  ciudad: 'Ciudad',
  idioma: 'Idioma principal de atención',

  telefonoContactoPersonal: 'Teléfono personal de contacto (técnico)',
  webInstagram: 'Web o Instagram',

  telefonoBot: 'Número de teléfono para el Bot',
  whatsappBusinessActivo: '¿Tienes WhatsApp Business activo para este número?',

  profesionales: 'Nombre de los profesionales que trabajan en el negocio',

  horarioApertura: 'Horario de apertura general',
  diasApertura: 'Días de apertura',
  diasCerradosFijos: 'Días cerrados fijos',
  intervaloCitas: 'Intervalo de citas (slots)',

  tattooArtists: 'Artistas',
  tattooEspecialidades: 'Especialidades de los artistas',
  tattooPiercings: '¿Todos los artistas hacen piercings o solo algunos?',
  tattooCoverups: '¿Todos hacen cover-ups o es especialidad de alguno?',
  tattooArtistasNuevos: '¿Algún artista no coge clientes nuevos o trabaja solo por proyectos?',
  tattooHorarioArtistas: 'Horario de cada artista (si difiere)',
  tattooPrecioPiercing: 'Precio del piercing (o rango por zona)',
  tattooMinimoSesion: '¿Tenéis precio mínimo de sesión?',
  tattooPreciosHoraOCerrado: '¿Precios por hora o precio cerrado según pieza?',
  tattooDeposito: '¿Pedís señal/depósito para reservar sesión? ¿Cuánto?',
  tattooOfertas: '¿Hacéis ofertas especiales?',
  tattooIntervaloCitas: 'Intervalo entre citas',
  tattooConsultaPrevia: 'Consulta previa para piezas grandes',
  tattooZonasEspeciales: '¿Tatuáis en cara, cuello, manos o zonas especiales?',
  tattooMenores: '¿Aceptáis menores de 18 con autorización?',
  tattooWalkins: '¿Aceptáis walk-ins si hay hueco o solo con cita?',
  tattooPoliticaTardanza: '¿Qué pasa si un cliente llega tarde o no aparece?',
  tattooDerivacion: 'Derivación',
  tattooTelefonoLlamadas: '¿Hay un número para llamadas o solo WhatsApp?',

  hairServiciosPrincipales: 'Servicios principales',
  hairServiciosColor: '¿Cómo gestionáis los servicios de color?',
  hairPreciosOrientativos: 'Precios orientativos (rangos)',
  hairTiempoMedioServicios: 'Tiempo medio por servicio',

  physioEspecialidades: 'Especialidades',
  physioDuracionSesiones: 'Duración de sesiones',
  physioPrecios: 'Precios (rango)',
  physioPrimeraConsulta: '¿La primera consulta tiene condiciones especiales?',

  psyModalidad: 'Modalidad',
  psyDuracionSesiones: 'Duración de sesiones',
  psyPrecios: 'Precios (rango)',
  psyUrgencias: 'Urgencias: ¿cómo se gestionan?',

  estServiciosPrincipales: 'Servicios principales',
  estContraindicaciones: 'Contraindicaciones o políticas (si aplica)',
  estPreciosOrientativos: 'Precios orientativos (rangos)',
  estBonos: '¿Tenéis bonos o packs? Describe condiciones',

  notas: 'Notas adicionales',
}

function buildPhase(payload: any, title: string, keys: string[]) {
  const items: Array<{ label: string; value: string }> = []
  for (const k of keys) {
    const raw = payload?.[k]
    const value = formatValue(raw)
    if (!value) continue
    items.push({ label: FIELD_LABELS[k] || k, value })
  }
  return { title, items }
}

function getDetailSections(payload: any) {
  const businessType = String(payload?.businessType || '').trim()
  const base = [
    buildPhase(payload, 'Fase 1 · Contacto', ['nombre', 'telefonoContactoPersonal', 'webInstagram']),
    buildPhase(payload, 'Fase 2 · Negocio', ['nombreNegocio', 'sector', 'direccionCompleta', 'ciudad', 'idioma']),
    buildPhase(payload, 'Fase 3 · WhatsApp y Bot', ['telefonoBot', 'whatsappBusinessActivo']),
    buildPhase(payload, 'Fase 4 · Equipo', ['profesionales']),
    buildPhase(payload, 'Fase 5 · Horarios y agenda', ['horarioApertura', 'diasApertura', 'diasCerradosFijos', 'intervaloCitas']),
  ]

  const sectorSpecific: Array<{ title: string; items: Array<{ label: string; value: string }> }> = []

  if (businessType === 'tatuajes') {
    sectorSpecific.push(buildPhase(payload, 'Fase 6 · Artistas', ['tattooArtists', 'tattooEspecialidades', 'tattooPiercings', 'tattooCoverups', 'tattooArtistasNuevos', 'tattooHorarioArtistas']))
    sectorSpecific.push(buildPhase(payload, 'Fase 7 · Servicios y precios', ['tattooPrecioPiercing', 'tattooMinimoSesion', 'tattooPreciosHoraOCerrado', 'tattooDeposito', 'tattooOfertas']))
    sectorSpecific.push(buildPhase(payload, 'Fase 8 · Políticas', ['tattooConsultaPrevia', 'tattooZonasEspeciales', 'tattooMenores', 'tattooWalkins', 'tattooPoliticaTardanza']))
    sectorSpecific.push(buildPhase(payload, 'Fase 9 · Derivación', ['tattooDerivacion', 'tattooTelefonoLlamadas', 'tattooIntervaloCitas']))
  }

  if (businessType === 'peluqueria') {
    sectorSpecific.push(buildPhase(payload, 'Fase 6 · Servicios', ['hairServiciosPrincipales', 'hairServiciosColor']))
    sectorSpecific.push(buildPhase(payload, 'Fase 7 · Tiempos y precios', ['hairPreciosOrientativos', 'hairTiempoMedioServicios']))
  }

  if (businessType === 'fisioterapeuta') {
    sectorSpecific.push(buildPhase(payload, 'Fase 6 · Servicios', ['physioEspecialidades', 'physioDuracionSesiones']))
    sectorSpecific.push(buildPhase(payload, 'Fase 7 · Precios y primera consulta', ['physioPrecios', 'physioPrimeraConsulta']))
  }

  if (businessType === 'psicologo') {
    sectorSpecific.push(buildPhase(payload, 'Fase 6 · Servicios', ['psyModalidad', 'psyDuracionSesiones']))
    sectorSpecific.push(buildPhase(payload, 'Fase 7 · Precios y urgencias', ['psyPrecios', 'psyUrgencias']))
  }

  if (businessType === 'estetica') {
    sectorSpecific.push(buildPhase(payload, 'Fase 6 · Servicios', ['estServiciosPrincipales', 'estContraindicaciones']))
    sectorSpecific.push(buildPhase(payload, 'Fase 7 · Precios y packs', ['estPreciosOrientativos', 'estBonos']))
  }

  const tail = [buildPhase(payload, 'Fase final · Notas', ['notas'])]

  return [...base, ...sectorSpecific, ...tail].filter((s) => s.items.length > 0)
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
