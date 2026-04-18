'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type BusinessType = 'peluqueria' | 'fisioterapeuta' | 'psicologo' | 'estetica' | 'tatuajes'

type FormState = {
  businessType: BusinessType | ''

  sector: string
  direccionCompleta: string
  telefonoContactoPersonal: string
  telefonoBot: string
  whatsappBusinessActivo: 'si' | 'no' | ''
  profesionales: string
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

const initialState: FormState = {
  businessType: '',

  sector: '',
  direccionCompleta: '',
  telefonoContactoPersonal: '',
  telefonoBot: '',
  whatsappBusinessActivo: '',
  profesionales: '',
  horarioApertura: '',
  diasApertura: '',
  diasCerradosFijos: '',
  intervaloCitas: '',

  ciudad: '',
  webInstagram: '',
  idioma: 'Español',
  notas: '',

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
    { key: 'sector', label: 'Sector', placeholder: 'Ej: Peluquería, Fisio, Tatuajes...', required: true },
    { key: 'direccionCompleta', label: 'Dirección completa', placeholder: 'Calle, número, piso, ciudad, CP', required: true },
    { key: 'telefonoContactoPersonal', label: 'Teléfono personal de contacto (técnico)', type: 'tel', placeholder: 'Ej: +34 600 000 000', required: true },
    { key: 'telefonoBot', label: 'Número de teléfono para el Bot', type: 'tel', placeholder: 'Ej: +34 600 000 000', required: true },
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
    { key: 'intervaloCitas', label: 'Intervalo de citas (slots)', placeholder: 'Ej: 30 min / 45 min / 60 min', required: true },
    { key: 'webInstagram', label: 'Web o Instagram (si aplica)', placeholder: 'Ej: https://instagram.com/tu-negocio' },
    { key: 'idioma', label: 'Idioma principal de atención', placeholder: 'Ej: Español' },
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

  const totalSteps = form.businessType ? 3 : 1

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.businessType)
    if (step === 1) {
      const requiredKeys = commonFields.filter((f) => f.required).map((f) => f.key)
      return requiredKeys.every((k) => String(form[k] || '').trim().length > 0)
    }
    if (step === 2) {
      const requiredKeys = sectorSpecificFields.filter((f) => f.required).map((f) => f.key)
      return requiredKeys.every((k) => String(form[k] || '').trim().length > 0)
    }
    return true
  }, [step, form, commonFields, sectorSpecificFields])

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

  const stepTitle = useMemo(() => {
    if (step === 0) return 'Personalicemos tu bot'
    if (step === 1) return 'Información básica'
    return 'Detalles de tu negocio'
  }, [step])

  return (
    <div className="formulario-page">
      <div className="formulario-container">
        <div className="formulario-card">
          <div className="formulario-header">
            <div className="formulario-title">{stepTitle}</div>
            <div className="formulario-subtitle">
              {step === 0
                ? 'Rellena estas preguntas para facilitar al técnico una atención más personalizada.'
                : 'Cuanta más información, mejor quedará tu bot.'}
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
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.35 }}
              >
                {step === 0 ? (
                  <div>
                    <div className="formulario-step-question">¿Qué tipo de negocio tienes?</div>
                    <div className="formulario-type-grid">
                      {businessOptions.map((b) => (
                        <button
                          key={b.type}
                          type="button"
                          className={
                            form.businessType === b.type
                              ? 'formulario-type-card formulario-type-card-active'
                              : 'formulario-type-card'
                          }
                          onClick={() => setForm((p) => ({ ...p, businessType: b.type, sector: b.label }))}
                        >
                          <div className="formulario-type-title">{b.label}</div>
                          <div className="formulario-type-desc">{b.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="formulario-fields">
                    {commonFields.map((f) => (
                      <InputField
                        key={String(f.key)}
                        field={f}
                        value={String(form[f.key] || '')}
                        onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                      />
                    ))}
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="formulario-fields">
                    {sectorSpecificFields.map((f) => (
                      <InputField
                        key={String(f.key)}
                        field={f}
                        value={String(form[f.key] || '')}
                        onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                      />
                    ))}
                  </div>
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
                    <button
                      type="button"
                      className="formulario-btn formulario-btn-primary"
                      disabled={!canContinue || submitting}
                      onClick={() => setStep((s) => s + 1)}
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="formulario-btn formulario-btn-primary"
                      disabled={!canContinue || submitting}
                      onClick={onSubmit}
                    >
                      {submitting ? 'Enviando...' : 'Enviar'}
                    </button>
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
