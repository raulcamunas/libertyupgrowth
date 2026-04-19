'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  getDefaultFormSchema,
  listBusinessTypes,
  type BusinessType,
  type FormQuestion,
  type FormSchema,
  type FormStep,
} from '@/lib/forms/schema'

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

function schemaToSections(payload: any, schema: FormSchema | null) {
  if (!schema || !Array.isArray(schema.steps)) return getDetailSections(payload)

  const sections: Array<{ title: string; items: Array<{ label: string; value: string }> }> = []

  for (const step of schema.steps as FormStep[]) {
    if (step.kind !== 'fields' && step.kind !== 'horarios' && step.kind !== 'tattoo_artistas') continue
    const items: Array<{ label: string; value: string }> = []

    const fields = Array.isArray(step.fields) ? (step.fields as FormQuestion[]) : []
    for (const q of fields) {
      const raw = payload?.[q.key]
      const value = formatValue(raw)
      if (!value) continue
      items.push({ label: q.label || FIELD_LABELS[q.key] || q.key, value })
    }

    if (items.length === 0) continue
    sections.push({ title: step.title || step.id, items })
  }

  if (sections.length === 0) return getDetailSections(payload)
  return sections
}

function normalizeBusinessType(v: any): BusinessType | null {
  const t = String(v || '').trim().toLowerCase()
  const allowed = new Set(listBusinessTypes())
  if (!t || !allowed.has(t as any)) return null
  return t as BusinessType
}

function cloneJson<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
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
export default function FormSubmissionsClient({
  submissions,
  canEditSchemas = false,
}: {
  submissions: FormSubmissionRow[]
  canEditSchemas?: boolean
}) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'envios' | 'formularios'>('envios')

  const [schemasByType, setSchemasByType] = useState<Record<string, FormSchema>>({})
  const [schemaType, setSchemaType] = useState<BusinessType>('peluqueria')
  const [schemaDraft, setSchemaDraft] = useState<FormSchema>(() => getDefaultFormSchema('peluqueria'))
  const [schemaSaving, setSchemaSaving] = useState(false)
  const [schemaError, setSchemaError] = useState('')

  useEffect(() => {
    if (!canEditSchemas) return
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/erp/form-schemas')
        const json = await res.json()
        const list = (json?.schemas || []) as FormSchema[]
        const next: Record<string, FormSchema> = {}
        for (const s of list) {
          const bt = normalizeBusinessType((s as any)?.businessType)
          if (!bt) continue
          next[bt] = s
        }
        for (const bt of listBusinessTypes()) {
          if (!next[bt]) next[bt] = getDefaultFormSchema(bt)
        }
        if (!active) return
        setSchemasByType(next)
      } catch {
        const next: Record<string, FormSchema> = {}
        for (const bt of listBusinessTypes()) next[bt] = getDefaultFormSchema(bt)
        if (!active) return
        setSchemasByType(next)
      }
    })()

    return () => {
      active = false
    }
  }, [canEditSchemas])

  useEffect(() => {
    if (!canEditSchemas) return
    const s = schemasByType[schemaType]
    setSchemaDraft(cloneJson(s || getDefaultFormSchema(schemaType)))
  }, [canEditSchemas, schemaType, schemasByType])

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

  const selectedBusinessType = useMemo(() => normalizeBusinessType(selected?.payload?.businessType), [selected])
  const selectedSchema = useMemo(() => {
    const bt = selectedBusinessType
    if (!bt) return null
    return schemasByType[bt] || null
  }, [selectedBusinessType, schemasByType])

  const schemasReady = Object.keys(schemasByType || {}).length > 0

  useEffect(() => {
    if (canEditSchemas) return
    setTab('envios')
  }, [canEditSchemas])

  const saveSchema = async () => {
    if (!canEditSchemas) return
    setSchemaError('')
    setSchemaSaving(true)
    try {
      const res = await fetch('/api/erp/form-schemas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ businessType: schemaType, schema: schemaDraft }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'No se ha podido guardar')
      setSchemasByType((p) => ({ ...p, [schemaType]: cloneJson(schemaDraft) }))
    } catch (e: any) {
      setSchemaError(e?.message || 'No se ha podido guardar')
    } finally {
      setSchemaSaving(false)
    }
  }

  const addStep = (kind: FormStep['kind']) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const idBase = kind === 'fields' ? 'paso' : kind
      const id = `${idBase}-${Date.now()}`
      next.steps = Array.isArray(next.steps) ? next.steps : []
      next.steps.push({ id, title: 'Nuevo paso', subtitle: '', kind, fields: [] })
      return next
    })
  }

  const moveStep = (idx: number, dir: -1 | 1) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const steps = Array.isArray(next.steps) ? next.steps : []
      const j = idx + dir
      if (j < 0 || j >= steps.length) return next
      const tmp = steps[idx]
      steps[idx] = steps[j]
      steps[j] = tmp
      next.steps = steps
      return next
    })
  }

  const removeStep = (idx: number) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const steps = Array.isArray(next.steps) ? next.steps : []
      steps.splice(idx, 1)
      next.steps = steps
      return next
    })
  }

  const addQuestion = (stepIdx: number) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const steps = Array.isArray(next.steps) ? next.steps : []
      const step = steps[stepIdx]
      if (!step) return next
      if (step.kind !== 'fields' && step.kind !== 'horarios') return next
      step.fields = Array.isArray(step.fields) ? step.fields : []
      step.fields.push({ key: `campo_${Date.now()}`, label: 'Nueva pregunta', type: 'text', required: false, placeholder: '' })
      return next
    })
  }

  const moveQuestion = (stepIdx: number, qIdx: number, dir: -1 | 1) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const step = next.steps?.[stepIdx]
      if (!step || !Array.isArray(step.fields)) return next
      const j = qIdx + dir
      if (j < 0 || j >= step.fields.length) return next
      const tmp = step.fields[qIdx]
      step.fields[qIdx] = step.fields[j]
      step.fields[j] = tmp
      return next
    })
  }

  const removeQuestion = (stepIdx: number, qIdx: number) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const step = next.steps?.[stepIdx]
      if (!step || !Array.isArray(step.fields)) return next
      step.fields.splice(qIdx, 1)
      return next
    })
  }

  const setQuestionPatch = (stepIdx: number, qIdx: number, patch: Partial<FormQuestion>) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const step = next.steps?.[stepIdx]
      if (!step || !Array.isArray(step.fields)) return next
      step.fields[qIdx] = { ...(step.fields[qIdx] as any), ...patch }
      return next
    })
  }

  const setStepPatch = (stepIdx: number, patch: Partial<FormStep>) => {
    setSchemaDraft((p) => {
      const next = cloneJson(p)
      const step = next.steps?.[stepIdx]
      if (!step) return next
      next.steps[stepIdx] = { ...step, ...patch }
      return next
    })
  }

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="formsub-head">
          <div>
            <div className="erp-miniapp-title">Formularios</div>
            <div className="erp-miniapp-subtitle">Envíos capturados del onboarding</div>
          </div>

          <div className="formsub-search" style={{ gap: 10 }}>
            <button type="button" className="formsub-copy" onClick={() => setTab('envios')}>
              Envíos
            </button>
            {canEditSchemas ? (
              <button type="button" className="formsub-copy" onClick={() => setTab('formularios')}>
                Formularios
              </button>
            ) : null}
          </div>

          <div className="formsub-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cualquier campo..."
              className="formsub-input"
              disabled={tab !== 'envios'}
            />
          </div>
        </div>

        {tab === 'formularios' ? (
          <div className="formsub-detail" style={{ marginTop: 16 }}>
            <div className="formsub-detail-card">
              <div className="formsub-detail-top">
                <div>
                  <div className="formsub-detail-title">Editor de formularios</div>
                  <div className="formsub-detail-subtitle">Edita pasos y preguntas por tipo de negocio</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <select
                    className="formsub-input"
                    value={schemaType}
                    onChange={(e) => setSchemaType(e.target.value as BusinessType)}
                    style={{ maxWidth: 240 }}
                  >
                    {listBusinessTypes().map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <button className="formsub-copy" type="button" onClick={saveSchema} disabled={schemaSaving || !schemasReady}>
                    {schemaSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              {schemaError ? <div className="formsub-empty">{schemaError}</div> : null}

              <div className="formsub-sections">
                <div className="formsub-section">
                  <div className="formsub-section-title">Añadir paso</div>
                  <div className="formsub-section-rows">
                    <div className="formsub-row">
                      <div className="formsub-row-label">Tipo de paso</div>
                      <div className="formsub-row-value" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button className="formsub-copy" type="button" onClick={() => addStep('fields')}>
                          + Normal
                        </button>
                        <button className="formsub-copy" type="button" onClick={() => addStep('horarios')}>
                          + Horarios
                        </button>
                        <button className="formsub-copy" type="button" onClick={() => addStep('tattoo_artistas')}>
                          + Artistas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {(schemaDraft.steps || []).map((st, idx) => (
                  <div key={st.id || idx} className="formsub-section">
                    <div className="formsub-section-title" style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <span>
                        Paso {idx + 1} · {st.kind}
                      </span>
                      <span style={{ display: 'flex', gap: 8 }}>
                        <button className="formsub-copy" type="button" onClick={() => moveStep(idx, -1)}>
                          ↑
                        </button>
                        <button className="formsub-copy" type="button" onClick={() => moveStep(idx, 1)}>
                          ↓
                        </button>
                        <button className="formsub-copy" type="button" onClick={() => removeStep(idx)}>
                          Eliminar
                        </button>
                      </span>
                    </div>

                    <div className="formsub-section-rows">
                      <div className="formsub-row">
                        <div className="formsub-row-label">ID</div>
                        <div className="formsub-row-value">
                          <input
                            className="formsub-input"
                            value={st.id || ''}
                            onChange={(e) => setStepPatch(idx, { id: e.target.value })}
                            placeholder="id-del-paso"
                          />
                        </div>
                      </div>

                      <div className="formsub-row">
                        <div className="formsub-row-label">Título</div>
                        <div className="formsub-row-value">
                          <input
                            className="formsub-input"
                            value={st.title || ''}
                            onChange={(e) => setStepPatch(idx, { title: e.target.value })}
                            placeholder="Título del paso"
                          />
                        </div>
                      </div>

                      <div className="formsub-row">
                        <div className="formsub-row-label">Subtítulo</div>
                        <div className="formsub-row-value">
                          <input
                            className="formsub-input"
                            value={st.subtitle || ''}
                            onChange={(e) => setStepPatch(idx, { subtitle: e.target.value })}
                            placeholder="Texto de ayuda"
                          />
                        </div>
                      </div>

                      <div className="formsub-row">
                        <div className="formsub-row-label">Tipo</div>
                        <div className="formsub-row-value">
                          <select
                            className="formsub-input"
                            value={st.kind}
                            onChange={(e) => setStepPatch(idx, { kind: e.target.value as any })}
                          >
                            <option value="fields">fields</option>
                            <option value="horarios">horarios</option>
                            <option value="tattoo_artistas">tattoo_artistas</option>
                          </select>
                        </div>
                      </div>

                      {st.kind === 'fields' || st.kind === 'horarios' ? (
                        <div className="formsub-row">
                          <div className="formsub-row-label">Preguntas</div>
                          <div className="formsub-row-value" style={{ display: 'flex', gap: 10 }}>
                            <button className="formsub-copy" type="button" onClick={() => addQuestion(idx)}>
                              + Añadir pregunta
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {st.kind === 'fields' || st.kind === 'horarios' ? (
                      <div className="formsub-section-rows" style={{ marginTop: 12 }}>
                        {(st.fields || []).map((q: any, qIdx: number) => (
                          <div key={`${st.id}-${qIdx}`} className="formsub-row" style={{ alignItems: 'flex-start' }}>
                            <div className="formsub-row-label">{qIdx + 1}</div>
                            <div className="formsub-row-value" style={{ width: '100%' }}>
                              <div style={{ display: 'grid', gap: 10 }}>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  <button className="formsub-copy" type="button" onClick={() => moveQuestion(idx, qIdx, -1)}>
                                    ↑
                                  </button>
                                  <button className="formsub-copy" type="button" onClick={() => moveQuestion(idx, qIdx, 1)}>
                                    ↓
                                  </button>
                                  <button className="formsub-copy" type="button" onClick={() => removeQuestion(idx, qIdx)}>
                                    Eliminar
                                  </button>
                                </div>

                                <input
                                  className="formsub-input"
                                  value={String(q.key || '')}
                                  onChange={(e) => setQuestionPatch(idx, qIdx, { key: e.target.value })}
                                  placeholder="key (ej: telefonoBot)"
                                />

                                <input
                                  className="formsub-input"
                                  value={String(q.label || '')}
                                  onChange={(e) => setQuestionPatch(idx, qIdx, { label: e.target.value })}
                                  placeholder="Pregunta / label"
                                />

                                <input
                                  className="formsub-input"
                                  value={String(q.placeholder || '')}
                                  onChange={(e) => setQuestionPatch(idx, qIdx, { placeholder: e.target.value })}
                                  placeholder="Placeholder"
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                  <select
                                    className="formsub-input"
                                    value={String(q.type || 'text')}
                                    onChange={(e) => setQuestionPatch(idx, qIdx, { type: e.target.value as any })}
                                  >
                                    <option value="text">text</option>
                                    <option value="tel">tel</option>
                                    <option value="textarea">textarea</option>
                                    <option value="select">select</option>
                                  </select>

                                  <select
                                    className="formsub-input"
                                    value={q.required ? 'si' : 'no'}
                                    onChange={(e) => setQuestionPatch(idx, qIdx, { required: e.target.value === 'si' })}
                                  >
                                    <option value="no">No requerido</option>
                                    <option value="si">Requerido</option>
                                  </select>
                                </div>

                                {String(q.type) === 'select' ? (
                                  <div style={{ display: 'grid', gap: 10 }}>
                                    <select
                                      className="formsub-input"
                                      value={q.allowCustom ? 'si' : 'no'}
                                      onChange={(e) => setQuestionPatch(idx, qIdx, { allowCustom: e.target.value === 'si' })}
                                    >
                                      <option value="no">Sin personalizado</option>
                                      <option value="si">Permitir personalizado</option>
                                    </select>

                                    <textarea
                                      className="formsub-input"
                                      rows={4}
                                      value={
                                        Array.isArray(q.options)
                                          ? q.options.map((o: any) => `${o.value}|${o.label}`).join('\n')
                                          : ''
                                      }
                                      onChange={(e) => {
                                        const lines = String(e.target.value || '')
                                          .split('\n')
                                          .map((l) => l.trim())
                                          .filter(Boolean)
                                        const options = lines
                                          .map((l) => {
                                            const [value, label] = l.split('|')
                                            const v = String(value || '').trim()
                                            const lb = String(label || v).trim()
                                            if (!v) return null
                                            return { value: v, label: lb }
                                          })
                                          .filter(Boolean)
                                        setQuestionPatch(idx, qIdx, { options: options as any })
                                      }}
                                      placeholder="Opciones (una por línea): valor|label"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {st.kind === 'tattoo_artistas' ? (
                      <div className="formsub-section-rows" style={{ marginTop: 12 }}>
                        <div className="formsub-row">
                          <div className="formsub-row-label">Nota</div>
                          <div className="formsub-row-value">
                            Este paso usa el selector especial de artistas (nombre + detalles). Puedes cambiar el título/subtítulo.
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="formsub-grid">
            <motion.div className="formsub-list" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
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
                      {schemaToSections(selected.payload, selectedSchema).map((sec) => (
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
        )}
      </div>
    </div>
  )
}
