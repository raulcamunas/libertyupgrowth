'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import jsPDF from 'jspdf'
import { useRouter } from 'next/navigation'

type FormState = {
  razonSocial: string
  taxId: string
  direccionFiscal: string
  email: string
}

export default function FirmaServiciosPage() {
  const router = useRouter()
  const sigRef = useRef<SignatureCanvas | null>(null)
  const signatureWrapRef = useRef<HTMLDivElement | null>(null)

  const [form, setForm] = useState<FormState>({
    razonSocial: '',
    taxId: '',
    direccionFiscal: '',
    email: '',
  })
  const [accepted, setAccepted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [signatureCanvasWidth, setSignatureCanvasWidth] = useState(920)
  const [signatureCanvasDpr, setSignatureCanvasDpr] = useState(1)

  useEffect(() => {
    const el = signatureWrapRef.current
    if (!el) return

    setSignatureCanvasDpr(Math.max(1, Math.floor(window.devicePixelRatio || 1)))

    const ro = new ResizeObserver(() => {
      const width = Math.max(320, Math.floor(el.getBoundingClientRect().width))
      setSignatureCanvasWidth(width)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const contractText = useMemo(
    () =>
      `CONTRATO DE PRESTACIÓN DE SERVICIOS DE AUTOMATIZACIÓN E IA\n\nENTRE:\nLiberty UpGrowth LLC, con domicilio social en 99 Wall Street #1068, New York, NY 10005, Estados Unidos (en adelante, el PRESTADOR).\n\nY:\n[Nombre del Cliente/Estudio], con DNI/NIF [Número], (en adelante, el CLIENTE).\n\n1. OBJETO DEL SERVICIO\nEl PRESTADOR integrará un Agente de Inteligencia Artificial en el número de WhatsApp propiedad del CLIENTE para las siguientes funciones:\n\n- Atención al cliente 24/7 y respuesta a consultas frecuentes.\n- Agendamiento automatizado de citas y gestión de disponibilidad.\n- Cualificación de leads y organización de la base de datos de clientes.\n\n2. PROPIEDAD Y ACCESO AL NÚMERO\n- Propiedad del Número: El CLIENTE mantiene en todo momento la propiedad, titularidad y acceso total a su número de WhatsApp Business. La implementación del Bot no implica la pérdida de control manual del número por parte del CLIENTE.\n- Continuidad: En caso de cese del servicio, el CLIENTE conserva su número y todos los contactos de su cuenta de WhatsApp. Únicamente se desactivará la capa de inteligencia artificial y automatización proporcionada por el PRESTADOR.\n\n3. PROTECCIÓN DE DATOS Y CONFIDENCIALIDAD (RGPD)\nDe acuerdo con los estándares internacionales de protección de datos y el RGPD:\n\n- No comercialización: Liberty UpGrowth LLC garantiza que no venderá, cederá ni manipulará los datos de los clientes del CLIENTE para fines comerciales propios o de terceros. Los datos se utilizan exclusivamente para el correcto funcionamiento del Bot.\n- Base de Datos: Los datos recolectados durante el servicio (citas, nombres, preferencias) pertenecen al CLIENTE. Si el servicio se cancela, el PRESTADOR entregará dicha información al CLIENTE y procederá al borrado de sus servidores para garantizar la privacidad.\n- Confidencialidad: Toda la información intercambiada se considera estrictamente confidencial y solo será accesible por el personal técnico necesario para la configuración.\n\n4. CONDICIONES ECONÓMICAS Y FACTURACIÓN\n- Configuración Inicial: Pago único de 197,00€.\n- Mantenimiento Mensual: Cuota de 97,00€/mes.\n- Estructura Fiscal: Al ser Liberty UpGrowth LLC una entidad constituida en EE.UU. y prestar un servicio internacional, la factura se emite exenta de IVA, siendo el precio final el estipulado sin cargos adicionales de impuestos indirectos.\n\n5. DURACIÓN Y CANCELACIÓN\nEl servicio es mensual y no tiene compromiso de permanencia. El CLIENTE puede cancelar el servicio notificándolo con 15 días de antelación al siguiente ciclo de facturación. Tras la cancelación, el PRESTADOR retirará las automatizaciones y el CLIENTE podrá seguir usando su número de forma manual o con otros sistemas.\n`,
    []
  )

  const contractTextFilled = useMemo(() => {
    const razon = form.razonSocial?.trim() || '[Nombre del Cliente/Estudio]'
    const tax = form.taxId?.trim() || '[Número]'
    return contractText
      .replace(/\[Nombre del Cliente\/Estudio\]/g, razon)
      .replace(/DNI\/NIF \[Número\]/g, `DNI/NIF ${tax}`)
  }, [contractText, form.razonSocial, form.taxId])

  const renderContract = (text: string) => {
    const blocks = text.split(/\n\n+/g)
    const elements: JSX.Element[] = []
    let pendingList: string[] = []

    const flushList = () => {
      if (!pendingList.length) return
      const items = pendingList
      pendingList = []
      elements.push(
        <ul key={`ul-${elements.length}`}>
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      )
    }

    blocks.forEach((raw) => {
      const block = raw.trim()
      if (!block) return

      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
      const allBullets = lines.length > 1 && lines.every((l) => l.startsWith('- '))
      if (allBullets) {
        pendingList.push(...lines.map((l) => l.replace(/^-\s+/, '')))
        return
      }

      flushList()

      const single = lines.join(' ')

      if (/^\d+\./.test(single)) {
        elements.push(<h3 key={`h3-${elements.length}`}>{single}</h3>)
        return
      }

      if (/^[A-ZÁÉÍÓÚÑ0-9\s\-()]+:$/.test(single) || /^[A-ZÁÉÍÓÚÑ0-9\s\-()]+$/.test(single)) {
        elements.push(<h2 key={`h2-${elements.length}`}>{single.replace(/:$/, '')}</h2>)
        return
      }

      elements.push(<p key={`p-${elements.length}`}>{single}</p>)
    })

    flushList()
    return elements
  }

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const clearSignature = () => {
    sigRef.current?.clear()
  }

  const validate = () => {
    if (!form.razonSocial.trim()) return 'Indica tu razón social o nombre'
    if (!form.taxId.trim()) return 'Indica tu DNI/NIF/Tax ID'
    if (!form.direccionFiscal.trim()) return 'Indica tu dirección fiscal'
    if (!form.email.trim()) return 'Indica tu correo electrónico'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Correo electrónico no válido'
    if (!accepted) return 'Debes aceptar los términos y la política de privacidad'
    if (!sigRef.current || sigRef.current.isEmpty()) return 'La firma es obligatoria'
    return ''
  }

  const generatePdf = async (signatureDataUrl: string) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const marginX = 48
    const usableWidth = pageWidth - marginX * 2

    let y = 48

    y += 10

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Contratación de Servicios de Automatización IA', marginX, y)
    y += 22

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Liberty UpGrowth LLC', marginX, y)
    y += 18

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Datos del Cliente', marginX, y)
    y += 16

    doc.setFont('helvetica', 'normal')
    const linesClient = [
      `Razón social / Nombre: ${form.razonSocial}`,
      `DNI/NIF/Tax ID: ${form.taxId}`,
      `Dirección fiscal: ${form.direccionFiscal}`,
      `Correo electrónico: ${form.email}`,
    ]

    linesClient.forEach((line) => {
      const split = doc.splitTextToSize(line, usableWidth)
      doc.text(split, marginX, y)
      y += split.length * 14
    })

    y += 10

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Contrato', marginX, y)
    y += 16

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const contractLines = doc.splitTextToSize(contractTextFilled, usableWidth)

    contractLines.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - 120) {
        doc.addPage()
        y = 48
      }
      doc.text(line, marginX, y)
      y += 12
    })

    y += 18

    if (y > doc.internal.pageSize.getHeight() - 160) {
      doc.addPage()
      y = 48
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Firma', marginX, y)
    y += 14

    const trimmedCanvas = sigRef.current?.getTrimmedCanvas()
    const sigW = trimmedCanvas?.width || 1
    const sigH = trimmedCanvas?.height || 1
    const maxSigW = Math.min(usableWidth, 320)
    const targetSigW = Math.min(maxSigW, sigW)
    const targetSigH = Math.max(70, Math.min(140, (targetSigW * sigH) / sigW))

    doc.addImage(signatureDataUrl, 'PNG', marginX, y, targetSigW, targetSigH)
    y += targetSigH + 20

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, marginX, y)

    doc.save(`contrato-libertyupgrowth-${form.taxId || 'cliente'}.pdf`)
  }

  const handleSubmit = async () => {
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const signatureDataUrl = sigRef.current!.getTrimmedCanvas().toDataURL('image/png')

    setProcessing(true)
    try {
      const res = await fetch('/api/firma-servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          signatureBase64: signatureDataUrl,
          contractText: contractTextFilled,
          accepted,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo enviar la firma')
      }

      await generatePdf(signatureDataUrl)
      router.push('/exito')
    } catch (e: any) {
      setError(e?.message || 'Error inesperado')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="contract-sign-page">
      <div className="contract-sign-container">
        <header className="contract-sign-header">
          <div className="contract-sign-header-left">
            <Image src="/logo.png" alt="Liberty UpGrowth" width={180} height={45} priority />
            <div className="contract-sign-header-text">
              <div className="contract-sign-header-title">
                Contratación de Servicios de Automatización IA
              </div>
              <div className="contract-sign-header-subtitle">Liberty UpGrowth LLC</div>
            </div>
          </div>
        </header>

        <div className="contract-sign-grid">
          <section className="contract-sign-card">
            <div className="contract-sign-card-header">
              <div className="contract-sign-card-title">Contrato</div>
              <div className="contract-sign-card-subtitle">Lee el contrato completo antes de firmar.</div>
            </div>
            <div className="contract-sign-contract-box">
              <div className="blog-post-body contract-sign-contract-body">
                {renderContract(contractTextFilled)}
              </div>
            </div>
          </section>

          <section className="contract-sign-card contract-sign-card-form">
            <div className="contract-sign-card-title">Datos del cliente</div>

            <div className="contract-sign-form-grid">
              <input
                value={form.razonSocial}
                onChange={onChange('razonSocial')}
                placeholder="Razón Social / Nombre"
                className="contract-sign-input"
              />
              <input
                value={form.taxId}
                onChange={onChange('taxId')}
                placeholder="DNI/NIF/Tax ID"
                className="contract-sign-input"
              />
              <input
                value={form.direccionFiscal}
                onChange={onChange('direccionFiscal')}
                placeholder="Dirección Fiscal"
                className="contract-sign-input"
              />
              <input
                value={form.email}
                onChange={onChange('email')}
                placeholder="Correo Electrónico"
                inputMode="email"
                className="contract-sign-input"
              />
            </div>

            <div className="contract-sign-divider" />

            <div className="contract-sign-card-title">Firma</div>
            <div className="contract-sign-card-subtitle">
              Firma con el dedo o stylus dentro del recuadro.
            </div>

            <div className="contract-sign-signature-wrap" ref={signatureWrapRef}>
              <SignatureCanvas
                ref={(ref: SignatureCanvas | null) => {
                  sigRef.current = ref
                }}
                penColor="#0b1b3a"
                canvasProps={{
                  width: signatureCanvasWidth * signatureCanvasDpr,
                  height: 220 * signatureCanvasDpr,
                  className: 'contract-sign-signature-canvas',
                  style: {
                    width: '100%',
                    height: 220,
                    touchAction: 'none',
                  },
                }}
              />
            </div>

            <button type="button" onClick={clearSignature} className="contract-sign-btn-secondary">
              Limpiar firma
            </button>

            <div className="contract-sign-divider" />

            <label className="contract-sign-checkbox">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>
                He leído el contrato y acepto los términos de servicio y la política de privacidad RGPD.
              </span>
            </label>

            {error ? <div className="contract-sign-error">{error}</div> : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={processing}
              className="contract-sign-btn-primary"
            >
              {processing ? 'Procesando...' : 'Finalizar y Firmar'}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
