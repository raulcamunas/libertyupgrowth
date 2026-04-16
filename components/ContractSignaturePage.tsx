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

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('No se pudo cargar la firma')
  const blob = await res.blob()
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer la firma'))
    reader.readAsDataURL(blob)
  })
}

type Props = {
  priceMonthlyEUR: string
  showCompanySignatureOnPage?: boolean
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height })
    img.onerror = () => reject(new Error('No se pudo leer la imagen'))
    img.src = dataUrl
  })
}

export default function ContractSignaturePage({
  priceMonthlyEUR,
  showCompanySignatureOnPage = false,
}: Props) {
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

  useEffect(() => {
    const el = signatureWrapRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      const width = Math.max(320, Math.floor(el.getBoundingClientRect().width))
      setSignatureCanvasWidth(width)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const getSignatureDataUrl = () => {
    const trimmed = sigRef.current?.getTrimmedCanvas()
    if (!trimmed) return ''

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const out = document.createElement('canvas')
    out.width = Math.floor(trimmed.width * dpr)
    out.height = Math.floor(trimmed.height * dpr)

    const ctx = out.getContext('2d')
    if (!ctx) return trimmed.toDataURL('image/png')

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(trimmed, 0, 0)

    return out.toDataURL('image/png')
  }

  const contractText = useMemo(
    () => `
      CONTRATO DE PRESTACIÓN DE SERVICIOS DE AUTOMATIZACIÓN E IA

      ENTRE:
      Liberty UpGrowth LLC, con domicilio social en 99 Wall Street #1068, New York, NY 10005, Estados Unidos (en adelante, el PRESTADOR).

      Y:
      [Nombre del Cliente/Estudio], con DNI/NIF [Número], (en adelante, el CLIENTE).

      1 OBJETO DEL SERVICIO:
      El PRESTADOR integrará un Agente de Inteligencia Artificial en el número de WhatsApp propiedad del CLIENTE para las siguientes funciones:

      - Atención al cliente 24/7 y respuesta a consultas frecuentes.
      - Agendamiento automatizado de citas y gestión de disponibilidad.
      - Cualificación de leads y organización de la base de datos de clientes.

      2 PROPIEDAD Y ACCESO AL NÚMERO

      - Propiedad del Número: El CLIENTE mantiene en todo momento la propiedad, titularidad y acceso total a su número de WhatsApp Business. La implementación del Bot no implica la pérdida de control manual del número por parte del CLIENTE.
      - Continuidad: En caso de cese del servicio, el CLIENTE conserva su número y todos los contactos de su cuenta de WhatsApp. Únicamente se desactivará la capa de inteligencia artificial y automatización proporcionada por el PRESTADOR.

      3 PROTECCIÓN DE DATOS Y CONFIDENCIALIDAD (RFPD)
      De acuerdo con los estándares internacionales de protección de datos y el RGPD:

      - No comercialización: Liberty UpGrowth LLC garantiza que no venderá, cederá ni manipulará los datos de los clientes del CLIENTE para fines comerciales propios o de terceros. Los datos se utilizan exclusivamente para el correcto funcionamiento del Bot.
      - Base de Datos: Los datos recolectados durante el servicio (citas, nombres, preferencias) pertenecen al CLIENTE. Si el servicio se cancela, el PRESTADOR entregará dicha información al CLIENTE y procederá al borrado de sus servidores para garantizar la privacidad.
      - Confidencialidad: Toda la información intercambiada se considera estrictamente confidencial y solo será accesible por el personal técnico necesario para la configuración.

      4 CONDICIONES ECONOMICAS Y DE FACTURACIÓN

      - Coste de set up (puesta en marcha): 197€ (sin IVA).
      - Cuota mensual del servicio: ${priceMonthlyEUR}€/mes (sin IVA).
      - El servicio se factura de forma mensual.
      - El cobro se realizará automáticamente a través de la tarjeta que el CLIENTE introduzca en la pasarela de pago de Stripe, el mismo día del mes en que se inicia el pago.

      5 DURACIÓN Y CANCELACIÓN

      - El servicio tendrá una duración indefinida hasta que cualquiera de las partes comunique su cancelación.
      - En caso de cancelación, no se reembolsará la cantidad abonada por los servicios, ya que corresponden a horas de trabajo puestas a disposición del CLIENTE.
    `,
    [priceMonthlyEUR]
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
      const firstLine = lines[0] || ''
      const restLines = lines.slice(1)

      if (/^\d+\s/.test(firstLine) && lines.length > 1) {
        flushList()
        elements.push(<h3 key={`h3-${elements.length}`}>{firstLine}</h3>)
        const restBlock = restLines.join('\n').trim()
        if (restBlock) {
          const restParts = restBlock.split(/\n\n+/g)
          restParts.forEach((p) => {
            const plines = p.split('\n').map((l) => l.trim()).filter(Boolean)
            const bullets = plines.length > 0 && plines.every((l) => l.startsWith('- '))
            if (bullets) {
              elements.push(
                <ul key={`ul-${elements.length}`}>
                  {plines.map((l, idx) => (
                    <li key={idx}>{l.replace(/^-\s+/, '')}</li>
                  ))}
                </ul>
              )
            } else {
              const single = plines.join(' ')
              if (single) elements.push(<p key={`p-${elements.length}`}>{single}</p>)
            }
          })
        }
        return
      }

      const allBullets = lines.length > 1 && lines.every((l) => l.startsWith('- '))
      if (allBullets) {
        pendingList.push(...lines.map((l) => l.replace(/^-\s+/, '')))
        return
      }

      flushList()

      const single = lines.join(' ')

      if (/^\d+\s/.test(single)) {
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
    const pageHeight = doc.internal.pageSize.getHeight()
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
      if (y > pageHeight - 160) {
        doc.addPage()
        y = 48
      }
      doc.text(line, marginX, y)
      y += 12
    })

    y += 18

    if (y > pageHeight - 180) {
      doc.addPage()
      y = 48
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Firmas', marginX, y)
    y += 14

    let companySignatureDataUrl = ''
    try {
      companySignatureDataUrl = await fetchImageAsDataUrl('/firma.png')
    } catch {
      companySignatureDataUrl = ''
    }

    const trimmedCanvas = sigRef.current?.getTrimmedCanvas()
    const clientSigW = trimmedCanvas?.width || 1
    const clientSigH = trimmedCanvas?.height || 1
    const companyDims = companySignatureDataUrl
      ? await getImageDimensions(companySignatureDataUrl)
      : { width: 1, height: 1 }

    const gap = 18
    const colW = (usableWidth - gap) / 2
    const boxH = 95

    const drawCentered = (
      dataUrl: string,
      imgW: number,
      imgH: number,
      x: number,
      y: number,
      boxW: number,
      boxH: number
    ) => {
      const scale = Math.min(boxW / imgW, boxH / imgH)
      const w = imgW * scale
      const h = imgH * scale
      const dx = x + (boxW - w) / 2
      const dy = y + (boxH - h) / 2
      doc.addImage(dataUrl, 'PNG', dx, dy, w, h)
    }

    drawCentered(signatureDataUrl, clientSigW, clientSigH, marginX, y, colW, boxH)
    if (companySignatureDataUrl) {
      drawCentered(
        companySignatureDataUrl,
        companyDims.width || 1,
        companyDims.height || 1,
        marginX + colW + gap,
        y,
        colW,
        boxH
      )
    }

    const labelY = y + boxH + 14
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(form.razonSocial || 'CLIENTE', marginX, labelY)
    if (companySignatureDataUrl) {
      doc.text('Liberty UpGrowth LLC', marginX + colW + gap, labelY)
    }

    y = labelY + 18

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, marginX, y)

    const fileName = `contrato-libertyupgrowth-${form.taxId || 'cliente'}.pdf`
    const pdfBlob = doc.output('blob') as Blob

    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    return { pdfBlob, fileName }
  }

  const handleSubmit = async () => {
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const signatureDataUrl = getSignatureDataUrl()

    setProcessing(true)
    try {
      const { pdfBlob, fileName } = await generatePdf(signatureDataUrl)

      const fd = new FormData()
      fd.append('razonSocial', form.razonSocial)
      fd.append('taxId', form.taxId)
      fd.append('direccionFiscal', form.direccionFiscal)
      fd.append('email', form.email)
      fd.append('accepted', String(accepted))
      fd.append('priceMonthlyEUR', priceMonthlyEUR)
      fd.append('contractText', contractTextFilled)
      fd.append('signatureBase64', signatureDataUrl)

      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' })
      fd.append('contrato_pdf', pdfFile)

      const res = await fetch('/api/firma-servicios', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo enviar la firma')
      }

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
              <div className="contract-sign-header-title">Contratación de Servicios de Automatización IA</div>
              <div className="contract-sign-header-subtitle">Liberty UpGrowth LLC · {priceMonthlyEUR}€ / mes</div>
            </div>
          </div>
        </header>

        <div className="contract-sign-grid">
          <section className="contract-sign-card contract-sign-card-contract">
            <div className="contract-sign-card-header">
              <div className="contract-sign-card-title">Contrato</div>
              <div className="contract-sign-card-subtitle">Lee el contrato completo antes de firmar.</div>
            </div>
            <div className="contract-sign-contract-box">
              <div className="contract-sign-contract-body">{renderContract(contractTextFilled)}</div>
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

            <div className="contract-sign-card-title">Firmas</div>
            <div className="contract-sign-card-subtitle">
              {showCompanySignatureOnPage
                ? 'Firma como CLIENTE. La firma de Liberty queda representada al lado.'
                : 'Firma como CLIENTE.'}
            </div>

            {showCompanySignatureOnPage ? (
              <div className="contract-sign-dual-signatures">
                <div className="contract-sign-signature-col">
                  <div className="contract-sign-signature-wrap" ref={signatureWrapRef}>
                    <SignatureCanvas
                      ref={(ref: SignatureCanvas | null) => {
                        sigRef.current = ref
                      }}
                      penColor="#0b1b3a"
                      canvasProps={{
                        width: signatureCanvasWidth,
                        height: 220,
                        className: 'contract-sign-signature-canvas',
                        style: {
                          width: '100%',
                          height: 220,
                          touchAction: 'none',
                        },
                      }}
                    />
                  </div>
                  <div className="contract-sign-signature-label">{form.razonSocial || 'CLIENTE'}</div>
                </div>

                <div className="contract-sign-signature-col">
                  <div className="contract-sign-signature-wrap contract-sign-signature-wrap-company">
                    <img
                      src="/firma.png"
                      alt="Firma Liberty UpGrowth"
                      className="contract-sign-company-signature"
                    />
                  </div>
                  <div className="contract-sign-signature-label">Liberty UpGrowth LLC</div>
                </div>
              </div>
            ) : (
              <div className="contract-sign-signature-col">
                <div className="contract-sign-signature-wrap" ref={signatureWrapRef}>
                  <SignatureCanvas
                    ref={(ref: SignatureCanvas | null) => {
                      sigRef.current = ref
                    }}
                    penColor="#0b1b3a"
                    canvasProps={{
                      width: signatureCanvasWidth,
                      height: 220,
                      className: 'contract-sign-signature-canvas',
                      style: {
                        width: '100%',
                        height: 220,
                        touchAction: 'none',
                      },
                    }}
                  />
                </div>
                <div className="contract-sign-signature-label">{form.razonSocial || 'CLIENTE'}</div>
              </div>
            )}

            <button type="button" onClick={clearSignature} className="contract-sign-btn-secondary">
              Limpiar firma
            </button>

            <div className="contract-sign-divider" />

            <label className="contract-sign-checkbox">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span>He leído el contrato y acepto los términos de servicio y la política de privacidad RGPD.</span>
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
