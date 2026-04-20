'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { getDefaultFormSchema, type BusinessType, type FormSchema, type FormStep, type FormQuestion } from '@/lib/forms/schema'

type TattooArtist = {
  name: string
  specialties: string
  schedule: string
  takesNewClients: 'si' | 'no' | ''
  doesPiercings: 'si' | 'no' | ''
  doesCoverups: 'si' | 'no' | ''
}

type DayKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'

type DaySchedule = {
  open: boolean
  from: string
  to: string
  from2: string
  to2: string
}

type WeeklySchedule = Record<DayKey, DaySchedule>

type FormState = {
  businessType: BusinessType | ''

  nombre: string

  sector: string
  direccionCompleta: string
  telefonoContactoPersonal: string
  telefonoBot: string
  whatsappBusinessActivo: 'si' | 'no' | ''
  profesionales: string

  horarioSemanal: WeeklySchedule
  horarioApertura: string
  diasApertura: string
  diasCerradosFijos: string
  intervaloCitas: string

  // extra comunes
  ciudad: string
  webInstagram: string
  idioma: string
  notas: string

  // tatuajes
  tattooArtists: TattooArtist[]
  tattooEspecialidades: string
  tattooPiercings: string
  tattooCoverups: string
  tattooArtistasNuevos: string
  tattooHorarioArtistas: string
  tattooPrecioPiercing: string
  tattooMinimoSesion: string
  tattooPreciosHoraOCerrado: string
  tattooDeposito: string
  tattooOfertas: string
  tattooIntervaloCitas: string
  tattooConsultaPrevia: string
  tattooZonasEspeciales: string
  tattooMenores: string
  tattooWalkins: string
  tattooPoliticaTardanza: string
  tattooDerivacion: string
  tattooTelefonoLlamadas: string

  // peluqueria
  hairServiciosPrincipales: string
  hairPreciosOrientativos: string
  hairServiciosColor: string
  hairTiempoMedioServicios: string

  // fisio
  physioEspecialidades: string
  physioDuracionSesiones: string
  physioPrecios: string
  physioPrimeraConsulta: string

  // psicologo
  psyModalidad: string
  psyDuracionSesiones: string
  psyPrecios: string
  psyUrgencias: string

  // estetica
  estServiciosPrincipales: string
  estPreciosOrientativos: string
  estBonos: string
  estContraindicaciones: string
} & Record<string, any>

function ArtistSelector({
  artists,
  onChange,
}: {
  artists: TattooArtist[]
  onChange: (next: TattooArtist[]) => void
}) {
  const addArtist = () => {
    onChange([
      ...artists,
      {
        name: '',
        specialties: '',
        schedule: '',
        takesNewClients: '',
        doesPiercings: '',
        doesCoverups: '',
      },
    ])
  }

  const removeArtist = () => {
    onChange(artists.slice(0, Math.max(0, artists.length - 1)))
  }

  const updateArtist = (index: number, patch: Partial<TattooArtist>) => {
    onChange(artists.map((a, i) => (i === index ? { ...a, ...patch } : a)))
  }

  return (
    <div className="formulario-artist-wrap">
      <div className="formulario-artist-top">
        <div className="formulario-artist-title">¿Cuántos artistas/empleados hay?</div>
        <div className="formulario-artist-counter">
          <button type="button" className="formulario-artist-btn" onClick={removeArtist} disabled={artists.length === 0}>
            −
          </button>
          <div className="formulario-artist-count">{artists.length}</div>
          <button type="button" className="formulario-artist-btn" onClick={addArtist}>
            +
          </button>
        </div>
      </div>

      {artists.length === 0 ? (
        <div className="formulario-artist-hint">Añade al menos 1 artista para continuar.</div>
      ) : null}

      <div className="formulario-artist-grid">
        {artists.map((a, idx) => (
          <div key={idx} className="formulario-artist-card">
            <div className="formulario-artist-card-title">Artista {idx + 1}</div>
            <label className="formulario-field">
              <div className="formulario-label">
                Nombre <span className="formulario-required"> *</span>
              </div>
              <input
                className="formulario-input"
                value={a.name}
                placeholder="Ej: Dany"
                onChange={(e) => updateArtist(idx, { name: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeeklyScheduleEditor({
  value,
  onChange,
}: {
  value: WeeklySchedule
  onChange: (next: WeeklySchedule) => void
}) {
  const days: { key: DayKey; label: string }[] = [
    { key: 'lun', label: 'Lunes' },
    { key: 'mar', label: 'Martes' },
    { key: 'mie', label: 'Miércoles' },
    { key: 'jue', label: 'Jueves' },
    { key: 'vie', label: 'Viernes' },
    { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' },
  ]

  const timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
  ]

  const updateDay = (day: DayKey, patch: Partial<DaySchedule>) => {
    onChange({ ...value, [day]: { ...value[day], ...patch } })
  }

  return (
    <div className="formulario-schedule">
      <div className="formulario-schedule-title">Horario semanal</div>
      <div className="formulario-schedule-subtitle">Selecciona los días abiertos y sus rangos horarios.</div>

      <div className="formulario-schedule-grid">
        {days.map((d) => {
          const v = value[d.key]
          return (
            <div key={d.key} className="formulario-schedule-day">
              <div className="formulario-schedule-day-top">
                <div className="formulario-schedule-day-name">{d.label}</div>
                <label className="formulario-schedule-toggle">
                  <input
                    type="checkbox"
                    checked={v.open}
                    onChange={(e) =>
                      updateDay(d.key, {
                        open: e.target.checked,
                        from: e.target.checked ? v.from || '10:00' : '',
                        to: e.target.checked ? v.to || '14:00' : '',
                        from2: e.target.checked ? v.from2 : '',
                        to2: e.target.checked ? v.to2 : '',
                      })
                    }
                  />
                  <span>{v.open ? 'Abierto' : 'Cerrado'}</span>
                </label>
              </div>

              {v.open ? (
                <div className="formulario-schedule-rows">
                  <div className="formulario-schedule-row">
                    <SelectOrCustom
                      label="Desde"
                      options={timeOptions}
                      value={v.from}
                      onChange={(nv) => updateDay(d.key, { from: nv })}
                    />
                    <SelectOrCustom
                      label="Hasta"
                      options={timeOptions}
                      value={v.to}
                      onChange={(nv) => updateDay(d.key, { to: nv })}
                    />
                  </div>

                  <div className="formulario-schedule-row">
                    <SelectOrCustom
                      label="Desde (2)"
                      options={timeOptions}
                      value={v.from2}
                      onChange={(nv) => updateDay(d.key, { from2: nv })}
                    />
                    <SelectOrCustom
                      label="Hasta (2)"
                      options={timeOptions}
                      value={v.to2}
                      onChange={(nv) => updateDay(d.key, { to2: nv })}
                    />
                  </div>
                </div>
              ) : (
                <div className="formulario-schedule-closed">No se ofrecen citas este día.</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const initialState: FormState = {
  businessType: '',

  nombre: '',

  sector: '',
  direccionCompleta: '',
  telefonoContactoPersonal: '',
  telefonoBot: '',
  whatsappBusinessActivo: '',
  profesionales: '',

  horarioSemanal: {
    lun: { open: true, from: '10:00', to: '14:00', from2: '16:00', to2: '20:00' },
    mar: { open: true, from: '10:00', to: '14:00', from2: '16:00', to2: '20:00' },
    mie: { open: true, from: '10:00', to: '14:00', from2: '16:00', to2: '20:00' },
    jue: { open: true, from: '10:00', to: '14:00', from2: '16:00', to2: '20:00' },
    vie: { open: true, from: '10:00', to: '14:00', from2: '16:00', to2: '20:00' },
    sab: { open: true, from: '10:00', to: '14:00', from2: '', to2: '' },
    dom: { open: false, from: '', to: '', from2: '', to2: '' },
  },
  horarioApertura: '',
  diasApertura: '',
  diasCerradosFijos: '',
  intervaloCitas: '',

  ciudad: '',
  webInstagram: '',
  idioma: 'Español',
  notas: '',

  tattooArtists: [],
  tattooEspecialidades: '',
  tattooPiercings: '',
  tattooCoverups: '',
  tattooArtistasNuevos: '',
  tattooHorarioArtistas: '',
  tattooPrecioPiercing: '',
  tattooMinimoSesion: '',
  tattooPreciosHoraOCerrado: '',
  tattooDeposito: '',
  tattooOfertas: '',
  tattooIntervaloCitas: '',
  tattooConsultaPrevia: '',
  tattooZonasEspeciales: '',
  tattooMenores: '',
  tattooWalkins: '',
  tattooPoliticaTardanza: '',
  tattooDerivacion: '',
  tattooTelefonoLlamadas: '',

  hairServiciosPrincipales: '',
  hairPreciosOrientativos: '',
  hairServiciosColor: '',
  hairTiempoMedioServicios: '',

  physioEspecialidades: '',
  physioDuracionSesiones: '',
  physioPrecios: '',
  physioPrimeraConsulta: '',

  psyModalidad: '',
  psyDuracionSesiones: '',
  psyPrecios: '',
  psyUrgencias: '',

  estServiciosPrincipales: '',
  estPreciosOrientativos: '',
  estBonos: '',
  estContraindicaciones: '',
}

type Field = {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'tel' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
  required?: boolean
  allowCustom?: boolean
}

function SelectOrCustom({
  label,
  required,
  options,
  value,
  placeholder,
  onChange,
}: {
  label: string
  required?: boolean
  options: { value: string; label: string }[]
  value: string
  placeholder?: string
  onChange: (v: string) => void
}) {
  const optionValues = useMemo(() => new Set(options.map((o) => o.value)), [options])
  const isCustom = value !== '' && !optionValues.has(value)
  const [customMode, setCustomMode] = useState(isCustom)
  const selectValue = customMode || isCustom ? '__custom__' : value

  return (
    <label className="formulario-field">
      <div className="formulario-label">
        {label}
        {required ? <span className="formulario-required"> *</span> : null}
      </div>
      <select
        className="formulario-input"
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value
          if (v === '__custom__') {
            setCustomMode(true)
            if (!isCustom && optionValues.has(value)) onChange('')
            return
          }
          setCustomMode(false)
          onChange(v)
        }}
      >
        <option value="">Selecciona...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        <option value="__custom__">Personalizado</option>
      </select>

      {selectValue === '__custom__' ? (
        <input
          className="formulario-input"
          value={value}
          placeholder={placeholder || 'Escribe tu respuesta'}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </label>
  )
}

function ProfessionalsField({
  label,
  required,
  value,
  placeholder,
  onChange,
}: {
  label: string
  required?: boolean
  value: string
  placeholder?: string
  onChange: (v: string) => void
}) {
  const [items, setItems] = useState<string[]>(() => {
    const parts = String(value || '').split('\n')
    const hasAny = parts.some((p) => p.trim())
    return hasAny ? parts : ['']
  })

  useEffect(() => {
    const incoming = String(value || '').split('\n').map((p) => p).filter((_, i, arr) => i < arr.length)
    const incomingJoined = incoming.map((v) => v.trim()).filter(Boolean).join('\n')
    const localJoined = items.map((v) => v.trim()).filter(Boolean).join('\n')
    if (incomingJoined !== localJoined) {
      const parts = String(value || '').split('\n')
      const hasAny = parts.some((p) => p.trim())
      setItems(hasAny ? parts : [''])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const commit = (next: string[]) => {
    setItems(next)
    onChange(next.map((v) => v.trim()).filter(Boolean).join('\n'))
  }

  const list = items.length > 0 ? items : ['']

  const setAt = (idx: number, next: string) => {
    commit(list.map((v, i) => (i === idx ? next : v)))
  }

  const add = () => {
    commit([...list, ''])
  }

  const remove = () => {
    if (list.length <= 1) return
    commit(list.slice(0, -1))
  }

  return (
    <div className="formulario-field">
      <div className="formulario-label">
        {label}
        {required ? <span className="formulario-required"> *</span> : null}
      </div>

      <div className="formulario-artist-top" style={{ padding: 0, marginBottom: 10 }}>
        <div className="formulario-artist-title" style={{ margin: 0 }}>
          Añade los profesionales (uno por línea)
        </div>
        <div className="formulario-artist-counter">
          <button
            type="button"
            className="formulario-artist-btn"
            onClick={remove}
            disabled={list.length <= 1}
          >
            −
          </button>
          <div className="formulario-artist-count">{list.length}</div>
          <button type="button" className="formulario-artist-btn" onClick={add}>
            +
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {list.map((p, idx) => (
          <input
            key={idx}
            className="formulario-input"
            value={p}
            placeholder={placeholder || 'Ej: Ana (color)'}
            onChange={(e) => setAt(idx, e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}

function InputField({
  field,
  value,
  onChange,
}: {
  field: Field
  value: string
  onChange: (v: string) => void
}) {
  const commonClass = 'formulario-input'

  if (field.key === 'profesionales') {
    return (
      <ProfessionalsField
        label={field.label}
        required={field.required}
        value={value}
        placeholder={field.placeholder}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'select' && field.allowCustom && field.options) {
    return (
      <SelectOrCustom
        label={field.label}
        required={field.required}
        options={field.options}
        value={value}
        placeholder={field.placeholder}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <label className="formulario-field">
        <div className="formulario-label">
          {field.label}
          {field.required ? <span className="formulario-required"> *</span> : null}
        </div>
        <textarea
          className={commonClass}
          rows={4}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="formulario-field">
        <div className="formulario-label">
          {field.label}
          {field.required ? <span className="formulario-required"> *</span> : null}
        </div>
        <select className={commonClass} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecciona...</option>
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <label className="formulario-field">
      <div className="formulario-label">
        {field.label}
        {field.required ? <span className="formulario-required"> *</span> : null}
      </div>
      <input
        className={commonClass}
        type={field.type || 'text'}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default function FormularioPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [schema, setSchema] = useState<FormSchema | null>(null)

  const businessOptions: { type: BusinessType; label: string; desc: string }[] = [
    { type: 'peluqueria', label: 'Peluquería', desc: 'Cortes, color, tratamientos, estética capilar.' },
    { type: 'fisioterapeuta', label: 'Fisioterapeuta', desc: 'Sesiones, tratamientos, rehabilitación.' },
    { type: 'psicologo', label: 'Psicólogo', desc: 'Terapia, modalidad, urgencias, sesiones.' },
    { type: 'estetica', label: 'Centro de estética', desc: 'Facial, corporal, depilación, bonos.' },
    { type: 'tatuajes', label: 'Estudio de tatuajes', desc: 'Tatuajes, piercings, reservas, políticas.' },
  ]

  useEffect(() => {
    const bt = form.businessType
    if (!bt) {
      setSchema(null)
      return
    }
    let active = true

    ;(async () => {
      try {
        const res = await fetch(`/api/form-schema?businessType=${encodeURIComponent(bt)}`)
        const json = await res.json()
        const next = (json?.schema as FormSchema) || getDefaultFormSchema(bt)
        if (!active) return
        setSchema(next)
      } catch {
        if (!active) return
        setSchema(getDefaultFormSchema(bt))
      }
    })()

    return () => {
      active = false
    }
  }, [form.businessType])

  const uiSteps = useMemo(() => {
    const intro = {
      id: 'intro',
      title: 'Personalicemos tu bot',
      subtitle:
        'Elige tu tipo de negocio para adaptar el onboarding. Si crees que falta información importante, no te preocupes: al final del formulario podrás añadir cualquier detalle en el campo de notas.',
      kind: 'fields' as const,
      fields: [] as FormQuestion[],
    }
    const tail = (schema?.steps || []) as FormStep[]
    return [intro, ...tail]
  }, [schema])

  const totalSteps = uiSteps.length

  const currentGroup = uiSteps[Math.min(step, uiSteps.length - 1)]

  const currentFields = useMemo(() => {
    if (!currentGroup) return [] as Field[]
    return (currentGroup.fields || []).map((q) => ({
      key: q.key,
      label: q.label,
      placeholder: q.placeholder,
      type: q.type,
      options: q.options,
      required: q.required,
      allowCustom: q.allowCustom,
    }))
  }, [currentGroup])

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.businessType)

    if (currentGroup?.kind === 'horarios') {
      const openDays = Object.values(form.horarioSemanal || {}).filter((d) => d.open)
      if (openDays.length === 0) return false
      const allHaveHours = openDays.every((d) => String(d.from || '').trim() && String(d.to || '').trim())
      if (!allHaveHours) return false
      return String(form.intervaloCitas || '').trim().length > 0
    }

    if (currentGroup?.kind === 'tattoo_artistas') {
      if (!Array.isArray(form.tattooArtists) || form.tattooArtists.length === 0) return false
      return form.tattooArtists.every((a) => String(a?.name || '').trim().length > 0)
    }

    const requiredKeys = currentFields.filter((f) => f.required).map((f) => f.key)
    if (requiredKeys.length === 0) return true
    return requiredKeys.every((k) => String(form[k] || '').trim().length > 0)
  }, [step, form, currentFields, currentGroup])

  useEffect(() => {
    if (!form.horarioSemanal) return
    const dayLabels: Record<DayKey, string> = {
      lun: 'Lunes',
      mar: 'Martes',
      mie: 'Miércoles',
      jue: 'Jueves',
      vie: 'Viernes',
      sab: 'Sábado',
      dom: 'Domingo',
    }

    const openDays = (Object.keys(form.horarioSemanal) as DayKey[]).filter((k) => form.horarioSemanal[k].open)
    const closedDays = (Object.keys(form.horarioSemanal) as DayKey[]).filter((k) => !form.horarioSemanal[k].open)

    const horarios = openDays
      .map((k) => {
        const d = form.horarioSemanal[k]
        const tramo1 = d.from && d.to ? `${d.from}-${d.to}` : ''
        const tramo2 = d.from2 && d.to2 ? ` y ${d.from2}-${d.to2}` : ''
        return `${dayLabels[k]}: ${tramo1}${tramo2}`
      })
      .join(' | ')

    const diasApertura = openDays.map((k) => dayLabels[k]).join(', ')
    const diasCerrados = closedDays.map((k) => dayLabels[k]).join(', ')

    setForm((p) => {
      if (p.horarioApertura === horarios && p.diasApertura === diasApertura && p.diasCerradosFijos === diasCerrados) return p
      return { ...p, horarioApertura: horarios, diasApertura, diasCerradosFijos: diasCerrados }
    })
  }, [form.horarioSemanal])

  const onSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/formulario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'Formulario /formulario',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se pudo enviar el formulario')

      setSuccess(true)
    } catch (e: any) {
      setError(e?.message || 'Error inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  const stepTitle = currentGroup?.title || 'Personalicemos tu bot'
  const stepSubtitle = currentGroup?.subtitle || ''

  const pageVariants = {
    initial: { opacity: 0, x: 24, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -24, filter: 'blur(4px)' },
  }

  const listVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <div className="formulario-page">
      <div className="formulario-page-grid" />
      <div className="formulario-container">
        <div className="formulario-card">
          <div className="formulario-header">
            <div className="formulario-brand-row">
              <div className="formulario-brand-logo">
                <img src="/logo.png" alt="Liberty UpGrowth" />
              </div>
              <div className="formulario-brand-step">
                Paso {Math.min(step + 1, totalSteps)} / {totalSteps}
              </div>
            </div>
            <div className="formulario-title">{stepTitle}</div>
            <div className="formulario-subtitle">
              {step === 0
                ? 'Personalicemos tu bot. Responde en menos de 2 minutos.'
                : stepSubtitle}
            </div>
          </div>

          <div className="formulario-progress">
            <div className="formulario-progress-bar" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="formulario-success"
              >
                <div className="formulario-success-title">¡Enviado!</div>
                <div className="formulario-success-text">Gracias. El técnico revisará la información y te contactará.</div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 ? (
                  <div>
                    <div className="formulario-step-question">¿Qué tipo de negocio tienes?</div>
                    <div className="formulario-type-grid">
                      {businessOptions.map((b) => (
                        <motion.button
                          key={b.type}
                          type="button"
                          className={
                            form.businessType === b.type
                              ? 'formulario-type-card formulario-type-card-active'
                              : 'formulario-type-card'
                          }
                          onClick={() => setForm((p) => ({ ...p, businessType: b.type, sector: b.label }))}
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="formulario-type-title">{b.label}</div>
                          <div className="formulario-type-desc">{b.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {currentGroup?.kind === 'horarios' ? (
                  <div className="formulario-fields">
                    <WeeklyScheduleEditor
                      value={form.horarioSemanal}
                      onChange={(next: WeeklySchedule) => setForm((p) => ({ ...p, horarioSemanal: next }))}
                    />

                    <div className="formulario-schedule-extra">
                      {(() => {
                        const q = (currentGroup.fields || []).find((x: any) => x?.key === 'intervaloCitas') as any
                        if (!q) return null
                        const field: Field = {
                          key: q.key,
                          label: q.label,
                          placeholder: q.placeholder,
                          type: q.type,
                          options: q.options,
                          required: q.required,
                          allowCustom: q.allowCustom,
                        }
                        return (
                          <InputField
                            field={field}
                            value={String(form.intervaloCitas || '')}
                            onChange={(v) => setForm((p) => ({ ...p, intervaloCitas: v }))}
                          />
                        )
                      })()}
                    </div>
                  </div>
                ) : null}

                {currentGroup?.kind === 'tattoo_artistas' ? (
                  <div className="formulario-fields">
                    <ArtistSelector
                      artists={form.tattooArtists}
                      onChange={(next) => setForm((p) => ({ ...p, tattooArtists: next }))}
                    />

                    {form.tattooArtists.length > 0 ? (
                      <div className="formulario-artist-details">
                        <div className="formulario-artist-details-title">Detalles por artista (opcional)</div>
                        <div className="formulario-artist-details-subtitle">
                          Esto ayuda al bot a responder con precisión sin repetir nombres.
                        </div>

                        <div className="formulario-artist-details-grid">
                          {form.tattooArtists.map((a, idx) => (
                            <div key={idx} className="formulario-artist-detail-card">
                              <div className="formulario-artist-detail-title">{a.name || `Artista ${idx + 1}`}</div>

                              <label className="formulario-field">
                                <div className="formulario-label">Especialidades</div>
                                <textarea
                                  className="formulario-input"
                                  rows={3}
                                  value={a.specialties}
                                  placeholder='Ej: realismo, fine line, acuarela'
                                  onChange={(e) =>
                                    setForm((p) => ({
                                      ...p,
                                      tattooArtists: p.tattooArtists.map((x, i) => (i === idx ? { ...x, specialties: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>

                              <label className="formulario-field">
                                <div className="formulario-label">Horario</div>
                                <input
                                  className="formulario-input"
                                  value={a.schedule}
                                  placeholder="Ej: Mar-Sáb (tardes)"
                                  onChange={(e) =>
                                    setForm((p) => ({
                                      ...p,
                                      tattooArtists: p.tattooArtists.map((x, i) => (i === idx ? { ...x, schedule: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>

                              <div className="formulario-artist-badges">
                                <label className="formulario-artist-badge">
                                  <span>Nuevos clientes</span>
                                  <select
                                    className="formulario-input"
                                    value={a.takesNewClients}
                                    onChange={(e) =>
                                      setForm((p) => ({
                                        ...p,
                                        tattooArtists: p.tattooArtists.map((x, i) =>
                                          i === idx ? { ...x, takesNewClients: e.target.value as any } : x
                                        ),
                                      }))
                                    }
                                  >
                                    <option value="">—</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                  </select>
                                </label>

                                <label className="formulario-artist-badge">
                                  <span>Piercings</span>
                                  <select
                                    className="formulario-input"
                                    value={a.doesPiercings}
                                    onChange={(e) =>
                                      setForm((p) => ({
                                        ...p,
                                        tattooArtists: p.tattooArtists.map((x, i) =>
                                          i === idx ? { ...x, doesPiercings: e.target.value as any } : x
                                        ),
                                      }))
                                    }
                                  >
                                    <option value="">—</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                  </select>
                                </label>

                                <label className="formulario-artist-badge">
                                  <span>Cover-ups</span>
                                  <select
                                    className="formulario-input"
                                    value={a.doesCoverups}
                                    onChange={(e) =>
                                      setForm((p) => ({
                                        ...p,
                                        tattooArtists: p.tattooArtists.map((x, i) =>
                                          i === idx ? { ...x, doesCoverups: e.target.value as any } : x
                                        ),
                                      }))
                                    }
                                  >
                                    <option value="">—</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                  </select>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {step > 0 && currentGroup?.kind !== 'tattoo_artistas' && currentGroup?.kind !== 'horarios' ? (
                  <motion.div className="formulario-fields" variants={listVariants} initial="initial" animate="animate">
                    {currentFields.map((f) => (
                      <motion.div key={String(f.key)} variants={itemVariants}>
                        <InputField
                          field={f}
                          value={String(form[f.key] || '')}
                          onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}

                {error ? <div className="formulario-error">{error}</div> : null}

                <div className="formulario-actions">
                  <button
                    type="button"
                    className="formulario-btn formulario-btn-secondary"
                    disabled={submitting || step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    Atrás
                  </button>

                  {step < totalSteps - 1 ? (
                    <motion.button
                      type="button"
                      className="formulario-btn formulario-btn-primary"
                      disabled={!canContinue || submitting}
                      onClick={() => setStep((s) => s + 1)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Continuar
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      className="formulario-btn formulario-btn-primary"
                      disabled={!canContinue || submitting}
                      onClick={onSubmit}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {submitting ? 'Enviando...' : 'Enviar'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
