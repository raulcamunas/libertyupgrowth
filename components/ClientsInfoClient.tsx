'use client'

import { useEffect, useMemo, useState } from 'react'

type ClientRow = {
  id: string
  created_at: string
  name: string | null
  business_name: string | null
  email: string | null
  phone: string | null
  contract_signed_at: string | null
  contract_path: string | null
}

function formatDate(iso: string) {
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

export default function ClientsInfoClient() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) => {
      const s = `${c.business_name || ''} ${c.name || ''} ${c.email || ''} ${c.phone || ''}`.toLowerCase()
      return s.includes(q)
    })
  }, [clients, query])

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/erp/clients', { method: 'GET' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido cargar')
      setClients((data?.clients || []) as ClientRow[])
    } catch (e: any) {
      setError(e?.message || 'No se ha podido cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const downloadContract = async (id: string) => {
    try {
      const res = await fetch(`/api/erp/clients/${id}/contract`, { method: 'GET' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido generar el enlace')
      if (data?.url) window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (e: any) {
      setError(e?.message || 'No se ha podido descargar')
    }
  }

  const onUpload = async (id: string, file: File) => {
    setError('')
    setUploadingId(id)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/erp/clients/${id}/contract`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido subir')
      await load()
    } catch (e: any) {
      setError(e?.message || 'No se ha podido subir')
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="formsub-head">
          <div>
            <div className="erp-miniapp-title">Info clientes</div>
            <div className="erp-miniapp-subtitle">Clientes con contrato firmado y descarga de PDF</div>
          </div>

          <div className="formsub-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, negocio, email o teléfono..."
              className="formsub-input"
            />
          </div>
        </div>

        {error ? <div className="leads-add-error">{error}</div> : null}

        {loading ? (
          <div className="erp-miniapp-empty">Cargando...</div>
        ) : (
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            {filtered.length === 0 ? <div className="erp-miniapp-empty">Sin resultados.</div> : null}

            {filtered.map((c) => {
              const title = c.business_name || c.name || c.email || c.phone || 'Cliente'
              const subtitle = [c.name && c.business_name ? c.name : '', c.email || '', c.phone || ''].filter(Boolean).join(' · ')
              return (
                <div
                  key={c.id}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: 12,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 950, color: 'rgba(255,255,255,0.92)' }}>{title}</div>
                    {subtitle ? <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.62)', fontSize: 12.5 }}>{subtitle}</div> : null}
                    {c.contract_signed_at ? (
                      <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                        Firmado: {formatDate(c.contract_signed_at)}
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Sin contrato subido</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label
                      style={{
                        height: 36,
                        padding: '0 12px',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.85)',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        opacity: uploadingId === c.id ? 0.6 : 1,
                      }}
                    >
                      <span>{uploadingId === c.id ? 'Subiendo...' : 'Subir contrato'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        disabled={uploadingId === c.id}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          void onUpload(c.id, f)
                          e.currentTarget.value = ''
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      className="formsub-copy"
                      disabled={!c.contract_path}
                      onClick={() => downloadContract(c.id)}
                      style={{ opacity: c.contract_path ? 1 : 0.45 }}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
