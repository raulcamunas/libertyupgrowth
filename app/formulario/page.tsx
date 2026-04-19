'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type BusinessType = 'peluqueria' | 'fisioterapeuta' | 'psicologo' | 'estetica' | 'tatuajes'

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
}

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
  key: keyof FormState
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

  const businessOptions: { type: BusinessType; label: string; desc: string }[] = [
    { type: 'peluqueria', label: 'Peluquería', desc: 'Cortes, color, tratamientos, estética capilar.' },
    { type: 'fisioterapeuta', label: 'Fisioterapeuta', desc: 'Sesiones, tratamientos, rehabilitación.' },
    { type: 'psicologo', label: 'Psicólogo', desc: 'Terapia, modalidad, urgencias, sesiones.' },
    { type: 'estetica', label: 'Centro de estética', desc: 'Facial, corporal, depilación, bonos.' },
    { type: 'tatuajes', label: 'Estudio de tatuajes', desc: 'Tatuajes, piercings, reservas, políticas.' },
  ]

  const commonFields: Field[] = [
    { key: 'nombre', label: 'Tu nombre', placeholder: 'Ej: Raúl', required: true },
    { key: 'sector', label: 'Sector', placeholder: 'Ej: Peluquería, Fisio, Tatuajes...', required: true },
    { key: 'direccionCompleta', label: 'Dirección completa', placeholder: 'Calle, número, piso, ciudad, CP', required: true },
    { key: 'telefonoContactoPersonal', label: 'Teléfono personal de contacto (técnico)', type: 'tel', placeholder: 'Ej: +34 600 000 000', required: true },
    { key: 'telefonoBot', label: '¿A qué número de teléfono vamos a instalar el Bot?', type: 'tel', placeholder: 'Ej: +34 600 000 000', required: true },
    {
      key: 'whatsappBusinessActivo',
      label: '¿Tienes WhatsApp Business activo para este número?',
      type: 'select',
      required: true,
      options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      key: 'profesionales',
      label: 'Nombre de los profesionales que trabajan en el negocio',
      placeholder: 'Ej: Ana (color), Juan (cortes), etc.',
      type: 'textarea',
      required: true,
    },
    { key: 'horarioApertura', label: 'Horario de apertura general', placeholder: 'Ej: 10:00-14:00 y 16:00-20:00', required: true },
    { key: 'diasApertura', label: 'Días de apertura', placeholder: 'Ej: Lunes a viernes, sábados mañana', required: true },
    { key: 'diasCerradosFijos', label: 'Días cerrados fijos', placeholder: 'Ej: Domingos y festivos' },
    {
      key: 'intervaloCitas',
      label: 'Intervalo de citas (slots)',
      type: 'select',
      allowCustom: true,
      required: true,
      placeholder: 'Ej: 30 min / 45 min / 60 min',
      options: [
        { value: '15 min', label: '15 min' },
        { value: '30 min', label: '30 min' },
        { value: '45 min', label: '45 min' },
        { value: '60 min', label: '60 min' },
        { value: '90 min', label: '90 min' },
      ],
    },
    { key: 'webInstagram', label: 'Web o Instagram (si aplica)', placeholder: 'Ej: https://instagram.com/tu-negocio' },
    {
      key: 'idioma',
      label: 'Idioma principal de atención',
      type: 'select',
      allowCustom: true,
      placeholder: 'Ej: Español',
      options: [
        { value: 'Español', label: 'Español' },
        { value: 'Inglés', label: 'Inglés' },
        { value: 'Español e Inglés', label: 'Español e Inglés' },
      ],
    },
    { key: 'notas', label: 'Notas adicionales', type: 'textarea', placeholder: 'Cualquier detalle que el técnico deba saber.' },
  ]
  const sectorSpecificFields = useMemo((): Field[] => {
    switch (form.businessType) {
      case 'tatuajes':
        return [
          {
            key: 'tattooEspecialidades',
            label: 'Especialidades de los artistas (Dany, David, Alejo, Giulia)',
            placeholder: 'Ej: Dany — realismo; Giulia — acuarela',
            type: 'textarea',
            required: true,
          },
          {
            key: 'tattooPiercings',
            label: '¿Todos los artistas hacen piercings o solo algunos?',
            placeholder: 'Indica quién y cómo se gestiona.',
            type: 'textarea',
            required: true,
          },
          {
            key: 'tattooCoverups',
            label: '¿Todos hacen cover-ups o es especialidad de alguno?',
            type: 'textarea',
            required: true,
          },
          {
            key: 'tattooArtistasNuevos',
            label: '¿Algún artista no coge clientes nuevos o trabaja solo por proyectos?',
            type: 'textarea',
            required: true,
          },
          {
            key: 'tattooHorarioArtistas',
            label: 'Horario de cada artista (si difiere)',
            placeholder: 'Ej: Todos mar-sáb; Alejo solo por tardes',
            type: 'textarea',
          },
          { key: 'tattooPrecioPiercing', label: 'Precio del piercing (o rango por zona)', type: 'textarea' },
          { key: 'tattooMinimoSesion', label: '¿Tenéis precio mínimo de sesión?', type: 'textarea' },
          { key: 'tattooPreciosHoraOCerrado', label: '¿Precios por hora o precio cerrado según pieza?', type: 'textarea' },
          { key: 'tattooDeposito', label: '¿Pedís señal/depósito para reservar sesión? ¿Cuánto?', type: 'textarea' },
          { key: 'tattooOfertas', label: '¿Hacéis ofertas especiales (2x1, descuentos, etc.)?', type: 'textarea' },
          { key: 'tattooIntervaloCitas', label: 'Intervalo entre citas (30 min / 60 min...)', type: 'text' },
          { key: 'tattooConsultaPrevia', label: 'Consulta previa para piezas grandes: ¿obligatoria o recomendada? ¿Cuánto dura?', type: 'textarea' },
          { key: 'tattooZonasEspeciales', label: '¿Tatuáis en cara, cuello, manos o zonas especiales?', type: 'textarea' },
          { key: 'tattooMenores', label: '¿Aceptáis menores de 18 con autorización?', type: 'textarea' },
          { key: 'tattooWalkins', label: '¿Aceptáis walk-ins si hay hueco o solo con cita?', type: 'textarea' },
          { key: 'tattooPoliticaTardanza', label: '¿Qué pasa si un cliente llega tarde o no aparece?', type: 'textarea' },
          { key: 'tattooDerivacion', label: 'Derivación: si el bot no puede resolver algo, ¿a quién derivamos y cómo se llama?', type: 'textarea', required: true },
          { key: 'tattooTelefonoLlamadas', label: '¿Hay un número para llamadas o solo WhatsApp?', type: 'textarea' },
        ]
      case 'peluqueria':
        return [
          { key: 'hairServiciosPrincipales', label: 'Servicios principales', placeholder: 'Corte, color, mechas, tratamientos...', type: 'textarea', required: true },
          { key: 'hairServiciosColor', label: '¿Cómo gestionáis los servicios de color? (duración, prueba, etc.)', type: 'textarea' },
          { key: 'hairPreciosOrientativos', label: 'Precios orientativos (rangos)', placeholder: 'Ej: corte 15-25€, mechas 60-120€', type: 'textarea' },
          { key: 'hairTiempoMedioServicios', label: 'Tiempo medio por servicio', placeholder: 'Ej: corte 30min, mechas 120min', type: 'textarea' },
        ]
      case 'fisioterapeuta':
        return [
          { key: 'physioEspecialidades', label: 'Especialidades', placeholder: 'Deportiva, suelo pélvico, rehabilitación...', type: 'textarea', required: true },
          { key: 'physioDuracionSesiones', label: 'Duración de sesiones', placeholder: 'Ej: 45min / 60min', type: 'text', required: true },
          { key: 'physioPrecios', label: 'Precios (rango)', placeholder: 'Ej: 40-60€', type: 'textarea' },
          { key: 'physioPrimeraConsulta', label: '¿La primera consulta tiene condiciones especiales?', type: 'textarea' },
        ]
      case 'psicologo':
        return [
          { key: 'psyModalidad', label: 'Modalidad', placeholder: 'Presencial / online / ambas', type: 'text', required: true },
          { key: 'psyDuracionSesiones', label: 'Duración de sesiones', placeholder: 'Ej: 50min', type: 'text', required: true },
          { key: 'psyPrecios', label: 'Precios (rango)', placeholder: 'Ej: 50-80€', type: 'textarea' },
          { key: 'psyUrgencias', label: 'Urgencias: ¿cómo se gestionan?', type: 'textarea' },
        ]
      case 'estetica':
        return [
          { key: 'estServiciosPrincipales', label: 'Servicios principales', placeholder: 'Facial, corporal, depilación...', type: 'textarea', required: true },
          { key: 'estPreciosOrientativos', label: 'Precios orientativos (rangos)', type: 'textarea' },
          { key: 'estBonos', label: '¿Tenéis bonos o packs? Describe condiciones', type: 'textarea' },
          { key: 'estContraindicaciones', label: 'Contraindicaciones o políticas (si aplica)', type: 'textarea' },
        ]
      default:
        return []
    }
  }, [form.businessType])

  const fieldByKey = useMemo(() => {
    const all = [...commonFields, ...sectorSpecificFields]
    const map = new Map<keyof FormState, Field>()
    for (const f of all) map.set(f.key, f)
    return map
  }, [commonFields, sectorSpecificFields])

  const stepGroups = useMemo(() => {
    const groups: {
      id: string
      title: string
      subtitle: string
      fields: (keyof FormState)[]
    }[] = []

    // Step 0 is business type selection (no fields here)
    groups.push({
      id: 'intro',
      title: 'Personalicemos tu bot',
      subtitle:
        'Elige tu tipo de negocio para adaptar el onboarding. Si crees que falta información importante, no te preocupes: al final del formulario podrás añadir cualquier detalle en el campo de notas.',
      fields: [],
    })

    if (!form.businessType) return groups

    // Comunes (más pasos, menos preguntas)
    groups.push({
      id: 'contacto',
      title: 'Datos de contacto',
      subtitle: 'Para que el técnico pueda ayudarte durante el alta.',
      fields: ['nombre', 'telefonoContactoPersonal', 'webInstagram'],
    })

    groups.push({
      id: 'negocio',
      title: 'Datos del negocio',
      subtitle: 'Ubicación y contexto para afinar el bot.',
      fields: ['sector', 'direccionCompleta', 'idioma'],
    })

    groups.push({
      id: 'whatsapp',
      title: 'WhatsApp y Bot',
      subtitle: 'Configurar el número correcto desde el principio.',
      fields: ['telefonoBot', 'whatsappBusinessActivo'],
    })

    groups.push({
      id: 'equipo',
      title: 'Equipo',
      subtitle: 'El bot puede mencionar profesionales y repartir derivaciones.',
      fields: ['profesionales'],
    })

    groups.push({
      id: 'horarios',
      title: 'Horarios y agenda',
      subtitle: 'Con esto el bot ofrecerá citas coherentes.',
      fields: ['horarioApertura', 'diasApertura', 'diasCerradosFijos', 'intervaloCitas'],
    })

    // Sector específico
    if (form.businessType === 'tatuajes') {
      groups.push({
        id: 'tattoo-artistas',
        title: 'Artistas',
        subtitle: 'Añade los nombres una sola vez y luego personalizamos preguntas por artista.',
        fields: [],
      })
      groups.push({
        id: 'tattoo-precios',
        title: 'Servicios y precios',
        subtitle: 'Para responder preguntas típicas y filtrar mejor.',
        fields: ['tattooPrecioPiercing', 'tattooMinimoSesion', 'tattooPreciosHoraOCerrado', 'tattooDeposito', 'tattooOfertas'],
      })
      groups.push({
        id: 'tattoo-politicas',
        title: 'Políticas del estudio',
        subtitle: 'Reglas clave: walk-ins, menores, zonas, etc.',
        fields: ['tattooConsultaPrevia', 'tattooZonasEspeciales', 'tattooMenores', 'tattooWalkins', 'tattooPoliticaTardanza'],
      })
      groups.push({
        id: 'tattoo-derivacion',
        title: 'Derivación',
        subtitle: 'Si el bot no puede resolver algo, ¿qué hacemos?',
        fields: ['tattooDerivacion', 'tattooTelefonoLlamadas', 'tattooIntervaloCitas'],
      })
    }

    if (form.businessType === 'peluqueria') {
      groups.push({
        id: 'hair-servicios',
        title: 'Servicios',
        subtitle: 'Qué ofreces y cómo lo gestionas.',
        fields: ['hairServiciosPrincipales', 'hairServiciosColor'],
      })
      groups.push({
        id: 'hair-precios',
        title: 'Tiempos y precios',
        subtitle: 'Ayuda al bot a orientar y reservar mejor.',
        fields: ['hairPreciosOrientativos', 'hairTiempoMedioServicios'],
      })
    }

    if (form.businessType === 'fisioterapeuta') {
      groups.push({
        id: 'physio-servicios',
        title: 'Servicios',
        subtitle: 'Especialidades y duración.',
        fields: ['physioEspecialidades', 'physioDuracionSesiones'],
      })
      groups.push({
        id: 'physio-precios',
        title: 'Precios y primera consulta',
        subtitle: 'Para resolver dudas frecuentes.',
        fields: ['physioPrecios', 'physioPrimeraConsulta'],
      })
    }

    if (form.businessType === 'psicologo') {
      groups.push({
        id: 'psy-servicios',
        title: 'Servicios',
        subtitle: 'Modalidad y duración.',
        fields: ['psyModalidad', 'psyDuracionSesiones'],
      })
      groups.push({
        id: 'psy-precios',
        title: 'Precios y urgencias',
        subtitle: 'Políticas para casos especiales.',
        fields: ['psyPrecios', 'psyUrgencias'],
      })
    }

    if (form.businessType === 'estetica') {
      groups.push({
        id: 'est-servicios',
        title: 'Servicios',
        subtitle: 'Qué haces y para quién.',
        fields: ['estServiciosPrincipales', 'estContraindicaciones'],
      })
      groups.push({
        id: 'est-precios',
        title: 'Precios y packs',
        subtitle: 'Bonos, rangos, condiciones.',
        fields: ['estPreciosOrientativos', 'estBonos'],
      })
    }

    groups.push({
      id: 'final',
      title: 'Últimos detalles',
      subtitle: 'Cualquier cosa extra que el técnico deba saber.',
      fields: ['notas'],
    })

    return groups
  }, [form.businessType])

  const totalSteps = stepGroups.length

  const currentGroup = stepGroups[Math.min(step, stepGroups.length - 1)]

  const currentFields = useMemo(() => {
    if (!currentGroup) return [] as Field[]
    return currentGroup.fields
      .map((k) => fieldByKey.get(k))
      .filter((f): f is Field => Boolean(f))
  }, [currentGroup, fieldByKey])

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.businessType)

    if (currentGroup?.id === 'horarios') {
      const openDays = Object.values(form.horarioSemanal || {}).filter((d) => d.open)
      if (openDays.length === 0) return false
      const allHaveHours = openDays.every((d) => String(d.from || '').trim() && String(d.to || '').trim())
      if (!allHaveHours) return false
      return String(form.intervaloCitas || '').trim().length > 0
    }

    if (currentGroup?.id === 'tattoo-artistas') {
      if (!Array.isArray(form.tattooArtists) || form.tattooArtists.length === 0) return false
      return form.tattooArtists.every((a) => String(a?.name || '').trim().length > 0)
    }

    const requiredKeys = currentFields.filter((f) => f.required).map((f) => f.key)
    if (requiredKeys.length === 0) return true
    return requiredKeys.every((k) => String(form[k] || '').trim().length > 0)
  }, [step, form, currentFields])

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
              <div className="formulario-brand-pill">Liberty UpGrowth</div>
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

                {currentGroup?.id === 'horarios' ? (
                  <div className="formulario-fields">
                    <WeeklyScheduleEditor
                      value={form.horarioSemanal}
                      onChange={(next: WeeklySchedule) => setForm((p) => ({ ...p, horarioSemanal: next }))}
                    />

                    <div className="formulario-schedule-extra">
                      <InputField
                        field={commonFields.find((f) => f.key === 'intervaloCitas')!}
                        value={String(form.intervaloCitas || '')}
                        onChange={(v) => setForm((p) => ({ ...p, intervaloCitas: v }))}
                      />
                    </div>
                  </div>
                ) : null}

                {currentGroup?.id === 'tattoo-artistas' ? (
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

                {step > 0 && currentGroup?.id !== 'tattoo-artistas' && currentGroup?.id !== 'horarios' ? (
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
