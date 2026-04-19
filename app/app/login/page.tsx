'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ErpLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!hasSupabaseEnv) {
        setError('Supabase no está configurado en este entorno.')
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
        setLoading(false)
        return
      }

      await new Promise((r) => setTimeout(r, 500))
      router.replace('/app')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="erp-login">
      <div className="erp-login-card">
        <div className="erp-login-brand">
          <div className="erp-brand">
            <div className="erp-brand-dot" />
            <div className="erp-brand-name">Liberty UpGrowth</div>
          </div>
          <div className="erp-login-title">Acceso al ERP</div>
          <div className="erp-login-subtitle">Inicia sesión para acceder a tus mini apps</div>
        </div>

        {!hasSupabaseEnv ? (
          <div className="erp-login-warning">Este panel requiere variables de entorno de Supabase (URL y ANON KEY).</div>
        ) : null}

        <form onSubmit={handleLogin} className="erp-login-form">
          {error ? <div className="erp-login-error">{error}</div> : null}

          <label className="erp-login-field">
            <div className="erp-login-label">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="erp-login-input"
              placeholder=""
              required
            />
          </label>

          <label className="erp-login-field">
            <div className="erp-login-label">Contraseña</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="erp-login-input"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading || !hasSupabaseEnv}
            className="erp-login-btn"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
