'use client'

import { useEffect, useMemo, useState } from 'react'
import { ERP_APPS } from '@/lib/erp/apps'

type Row = {
  email: string
  allowed_app_ids: string[]
}

export default function UsersAdminClient() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newEmail, setNewEmail] = useState('')
  const [newAllowed, setNewAllowed] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const apps = useMemo(() => ERP_APPS.filter((a) => a.id !== 'home' && !a.adminOnly), [])

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/erp/users', { method: 'GET' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido cargar')
      setRows((data?.rows || []) as Row[])
    } catch (e: any) {
      setError(e?.message || 'No se ha podido cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const toggleNewApp = (id: string) => {
    setNewAllowed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const createOrInvite = async () => {
    setError('')
    if (!newEmail.trim()) return
    const allowedAppIds = apps.filter((a) => newAllowed[a.id]).map((a) => a.id)

    setSaving(true)
    try {
      const res = await fetch('/api/erp/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), allowedAppIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido crear')

      setNewEmail('')
      setNewAllowed({})
      await load()
    } catch (e: any) {
      setError(e?.message || 'No se ha podido crear')
    } finally {
      setSaving(false)
    }
  }

  const updateRow = async (email: string, allowed_app_ids: string[]) => {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/erp/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, allowedAppIds: allowed_app_ids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido guardar')
      await load()
    } catch (e: any) {
      setError(e?.message || 'No se ha podido guardar')
    } finally {
      setSaving(false)
    }
  }

  const deleteRow = async (email: string) => {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/erp/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No se ha podido borrar')
      await load()
    } catch (e: any) {
      setError(e?.message || 'No se ha podido borrar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="erp-miniapp-title">Usuarios</div>
        <div className="erp-miniapp-subtitle">Gestiona accesos por usuario</div>

        {error ? <div className="leads-add-error">{error}</div> : null}

        <div className="leads-add-modal" style={{ width: '100%', marginTop: 12 }}>
          <div className="leads-add-title">Añadir / Invitar</div>
          <div className="leads-add-grid" style={{ gridTemplateColumns: '1fr' }}>
            <label className="leads-add-field">
              <div className="leads-add-label">Email</div>
              <input className="leads-add-input" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="usuario@dominio.com" />
            </label>
          </div>

          <div className="leads-add-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
            {apps.map((a) => (
              <label key={a.id} className="leads-add-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={!!newAllowed[a.id]} onChange={() => toggleNewApp(a.id)} />
                <div className="leads-add-label" style={{ margin: 0 }}>
                  {a.name}
                </div>
              </label>
            ))}
          </div>

          <div className="leads-add-actions">
            <button className="leads-add-create" type="button" onClick={createOrInvite} disabled={saving || !newEmail.trim()}>
              {saving ? 'Guardando...' : 'Crear / Invitar'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="leads-add-title">Usuarios existentes</div>
          {loading ? (
            <div className="erp-miniapp-empty">Cargando...</div>
          ) : rows.length === 0 ? (
            <div className="erp-miniapp-empty">No hay usuarios configurados.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {rows.map((r) => {
                const allowed = new Set(r.allowed_app_ids || [])
                return (
                  <div key={r.email} className="leads-add-modal" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                      <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{r.email}</div>
                      <button className="leads-add-cancel" type="button" onClick={() => deleteRow(r.email)} disabled={saving}>
                        Borrar
                      </button>
                    </div>

                    <div className="leads-add-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 12 }}>
                      {apps.map((a) => (
                        <label key={a.id} className="leads-add-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <input
                            type="checkbox"
                            checked={allowed.has(a.id)}
                            onChange={() => {
                              const next = new Set(r.allowed_app_ids || [])
                              if (next.has(a.id)) next.delete(a.id)
                              else next.add(a.id)
                              const nextArr = Array.from(next)
                              setRows((prev) => prev.map((x) => (x.email === r.email ? { ...x, allowed_app_ids: nextArr } : x)))
                            }}
                          />
                          <div className="leads-add-label" style={{ margin: 0 }}>
                            {a.name}
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="leads-add-actions">
                      <button className="leads-add-create" type="button" onClick={() => updateRow(r.email, r.allowed_app_ids)} disabled={saving}>
                        Guardar permisos
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
