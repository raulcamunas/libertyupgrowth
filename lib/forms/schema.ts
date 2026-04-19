export type BusinessType = 'peluqueria' | 'fisioterapeuta' | 'psicologo' | 'estetica' | 'tatuajes'

export type FormFieldType = 'text' | 'tel' | 'textarea' | 'select'

export type FormQuestion = {
  key: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  allowCustom?: boolean
  options?: Array<{ value: string; label: string }>
}

export type FormStepKind = 'fields' | 'horarios' | 'tattoo_artistas'

export type FormStep = {
  id: string
  title: string
  subtitle: string
  kind: FormStepKind
  fields: FormQuestion[]
}

export type FormSchema = {
  businessType: BusinessType
  title?: string
  steps: FormStep[]
}

export function getDefaultFormSchema(businessType: BusinessType): FormSchema {
  const commonContacto: FormQuestion[] = [
    { key: 'nombre', label: 'Tu nombre', type: 'text', placeholder: 'Ej: Raúl', required: true },
    {
      key: 'telefonoContactoPersonal',
      label: 'Teléfono donde el técnico te contactará',
      type: 'tel',
      placeholder: 'Ej: +34 600 000 000',
      required: true,
    },
    { key: 'webInstagram', label: 'Web o Instagram (si aplica)', type: 'text', placeholder: 'Ej: https://instagram.com/tu-negocio' },
  ]

  const commonNegocio: FormQuestion[] = [
    { key: 'sector', label: 'Sector', type: 'text', placeholder: 'Ej: Peluquería, Fisio, Tatuajes...', required: true },
    { key: 'direccionCompleta', label: 'Dirección completa', type: 'text', placeholder: 'Calle, número, piso, ciudad, CP', required: true },
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
  ]

  const commonWhatsapp: FormQuestion[] = [
    {
      key: 'telefonoBot',
      label: '¿A qué número de teléfono vamos a instalar el Bot?',
      type: 'tel',
      placeholder: 'Ej: +34 600 000 000',
      required: true,
    },
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
  ]

  const commonEquipo: FormQuestion[] = [
    {
      key: 'profesionales',
      label: 'Nombre de los profesionales que trabajan en tu negocio',
      type: 'textarea',
      placeholder: 'Ej: Ana (color), Juan (cortes), etc.',
      required: true,
    },
  ]

  const commonHorarios: FormQuestion[] = [
    {
      key: 'intervaloCitas',
      label: '¿Cuánto dura una cita de promedio? En la siguiente pestaña podrás profundizar',
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
  ]

  const finalNotas: FormQuestion[] = [{ key: 'notas', label: 'Notas adicionales', type: 'textarea', placeholder: 'Cualquier detalle que el técnico deba saber.' }]

  const steps: FormStep[] = [
    {
      id: 'contacto',
      title: 'Datos de contacto',
      subtitle: 'Para que el técnico pueda ayudarte durante el alta.',
      kind: 'fields',
      fields: commonContacto,
    },
    {
      id: 'negocio',
      title: 'Datos del negocio',
      subtitle: 'Ubicación y contexto para afinar el bot.',
      kind: 'fields',
      fields: commonNegocio,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp y Bot',
      subtitle: 'Configurar el número correcto desde el principio.',
      kind: 'fields',
      fields: commonWhatsapp,
    },
  ]

  if (businessType !== 'tatuajes') {
    steps.push({
      id: 'equipo',
      title: 'Equipo',
      subtitle: 'El bot puede mencionar profesionales y repartir derivaciones.',
      kind: 'fields',
      fields: commonEquipo,
    })
  }

  steps.push({
    id: 'horarios',
    title: 'Horarios y agenda',
    subtitle: 'Con esto el bot ofrecerá citas coherentes.',
    kind: 'horarios',
    fields: commonHorarios,
  })

  if (businessType === 'tatuajes') {
    steps.push({
      id: 'tattoo-artistas',
      title: 'Artistas',
      subtitle: 'Añade los nombres una sola vez y luego personalizamos preguntas por artista.',
      kind: 'tattoo_artistas',
      fields: [],
    })

    steps.push({
      id: 'tattoo-precios',
      title: 'Servicios y precios',
      subtitle: 'Para responder preguntas típicas y filtrar mejor.',
      kind: 'fields',
      fields: [
        { key: 'tattooPrecioPiercing', label: 'Precio del piercing (o rango por zona)', type: 'textarea' },
        { key: 'tattooMinimoSesion', label: '¿Tenéis precio mínimo de sesión?', type: 'textarea' },
        { key: 'tattooPreciosHoraOCerrado', label: '¿Precios por hora o precio cerrado según pieza?', type: 'textarea' },
        { key: 'tattooDeposito', label: '¿Pedís señal/depósito para reservar sesión? ¿Cuánto?', type: 'textarea' },
        { key: 'tattooOfertas', label: '¿Hacéis ofertas especiales (2x1, descuentos, etc.)?', type: 'textarea' },
      ],
    })

    steps.push({
      id: 'tattoo-politicas',
      title: 'Políticas del estudio',
      subtitle: 'Reglas clave: walk-ins, menores, zonas, etc.',
      kind: 'fields',
      fields: [
        {
          key: 'tattooConsultaPrevia',
          label: 'Consulta previa para piezas grandes: ¿obligatoria o recomendada? ¿Cuánto dura?',
          type: 'textarea',
        },
        { key: 'tattooZonasEspeciales', label: '¿Tatuáis en cara, cuello, manos o zonas especiales?', type: 'textarea' },
        { key: 'tattooMenores', label: '¿Aceptáis menores de 18 con autorización?', type: 'textarea' },
        { key: 'tattooWalkins', label: '¿Aceptáis walk-ins si hay hueco o solo con cita?', type: 'textarea' },
        { key: 'tattooPoliticaTardanza', label: '¿Qué pasa si un cliente llega tarde o no aparece?', type: 'textarea' },
      ],
    })

    steps.push({
      id: 'tattoo-derivacion',
      title: 'Derivación',
      subtitle: 'Si el bot no puede resolver algo, ¿qué hacemos?',
      kind: 'fields',
      fields: [
        {
          key: 'tattooDerivacion',
          label: 'Derivación: si el bot no puede resolver algo, ¿a quién derivamos y cómo se llama?',
          type: 'textarea',
          required: true,
        },
        { key: 'tattooTelefonoLlamadas', label: '¿Hay un número para llamadas o solo WhatsApp?', type: 'textarea' },
        { key: 'tattooIntervaloCitas', label: 'Intervalo entre citas (30 min / 60 min...)', type: 'text' },
      ],
    })
  }

  if (businessType === 'peluqueria') {
    steps.push({
      id: 'hair-servicios',
      title: 'Servicios',
      subtitle: 'Qué ofreces y cómo lo gestionas.',
      kind: 'fields',
      fields: [
        {
          key: 'hairServiciosPrincipales',
          label: 'Servicios principales',
          type: 'textarea',
          placeholder: 'Corte, color, mechas, tratamientos...',
          required: true,
        },
        {
          key: 'hairServiciosColor',
          label: '¿Cómo gestionáis los servicios de color? (duración, prueba, etc.)',
          type: 'textarea',
        },
      ],
    })

    steps.push({
      id: 'hair-precios',
      title: 'Tiempos y precios',
      subtitle: 'Ayuda al bot a orientar y reservar mejor.',
      kind: 'fields',
      fields: [
        {
          key: 'hairPreciosOrientativos',
          label: 'Precios orientativos (rangos)',
          type: 'textarea',
          placeholder: 'Ej: corte 15-25€, mechas 60-120€',
        },
        {
          key: 'hairTiempoMedioServicios',
          label: 'Tiempo medio por servicio',
          type: 'textarea',
          placeholder: 'Ej: corte 30min, mechas 120min',
        },
      ],
    })
  }

  if (businessType === 'fisioterapeuta') {
    steps.push({
      id: 'physio-servicios',
      title: 'Servicios',
      subtitle: 'Especialidades y duración.',
      kind: 'fields',
      fields: [
        {
          key: 'physioEspecialidades',
          label: 'Especialidades',
          type: 'textarea',
          placeholder: 'Deportiva, suelo pélvico, rehabilitación...',
          required: true,
        },
        {
          key: 'physioDuracionSesiones',
          label: 'Duración de sesiones',
          type: 'text',
          placeholder: 'Ej: 45min / 60min',
          required: true,
        },
      ],
    })

    steps.push({
      id: 'physio-precios',
      title: 'Precios y primera consulta',
      subtitle: 'Para resolver dudas frecuentes.',
      kind: 'fields',
      fields: [
        { key: 'physioPrecios', label: 'Precios (rango)', type: 'textarea', placeholder: 'Ej: 40-60€' },
        { key: 'physioPrimeraConsulta', label: '¿La primera consulta tiene condiciones especiales?', type: 'textarea' },
      ],
    })
  }

  if (businessType === 'psicologo') {
    steps.push({
      id: 'psy-servicios',
      title: 'Servicios',
      subtitle: 'Modalidad y duración.',
      kind: 'fields',
      fields: [
        { key: 'psyModalidad', label: 'Modalidad', type: 'text', placeholder: 'Presencial / online / ambas', required: true },
        { key: 'psyDuracionSesiones', label: 'Duración de sesiones', type: 'text', placeholder: 'Ej: 50min', required: true },
      ],
    })

    steps.push({
      id: 'psy-precios',
      title: 'Precios y urgencias',
      subtitle: 'Políticas para casos especiales.',
      kind: 'fields',
      fields: [
        { key: 'psyPrecios', label: 'Precios (rango)', type: 'textarea', placeholder: 'Ej: 50-80€' },
        { key: 'psyUrgencias', label: 'Urgencias: ¿cómo se gestionan?', type: 'textarea' },
      ],
    })
  }

  if (businessType === 'estetica') {
    steps.push({
      id: 'est-servicios',
      title: 'Servicios',
      subtitle: 'Qué haces y para quién.',
      kind: 'fields',
      fields: [
        {
          key: 'estServiciosPrincipales',
          label: 'Servicios principales',
          type: 'textarea',
          placeholder: 'Facial, corporal, depilación...',
          required: true,
        },
        { key: 'estContraindicaciones', label: 'Contraindicaciones o políticas (si aplica)', type: 'textarea' },
      ],
    })

    steps.push({
      id: 'est-precios',
      title: 'Precios y packs',
      subtitle: 'Bonos, rangos, condiciones.',
      kind: 'fields',
      fields: [
        { key: 'estPreciosOrientativos', label: 'Precios orientativos (rangos)', type: 'textarea' },
        { key: 'estBonos', label: '¿Tenéis bonos o packs? Describe condiciones', type: 'textarea' },
      ],
    })
  }

  steps.push({
    id: 'final',
    title: 'Últimos detalles',
    subtitle: 'Cualquier cosa extra que el técnico deba saber.',
    kind: 'fields',
    fields: finalNotas,
  })

  return { businessType, steps }
}

export function listBusinessTypes(): BusinessType[] {
  return ['peluqueria', 'fisioterapeuta', 'psicologo', 'estetica', 'tatuajes']
}
