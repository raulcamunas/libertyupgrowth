'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Error de login:', error)
        
        // Mensajes de error más claros
        if (error.message.includes('Invalid login credentials')) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Tu email no está confirmado. Por favor, confírmalo desde Supabase Dashboard.')
        } else {
          setError(error.message || 'Error al iniciar sesión')
        }
        setLoading(false)
        return
      }

      if (data.user) {
        console.log('✅ Login exitoso, usuario:', data.user.email)
        
        // Esperar un momento para que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Verificar que la sesión está activa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Error al obtener sesión:', sessionError)
          setError('Error al establecer la sesión. Intenta de nuevo.')
          setLoading(false)
          return
        }
        
        if (session) {
          console.log('✅ Sesión establecida correctamente')
          console.log('📋 Cookies:', document.cookie.substring(0, 200))
          
          // Usar router.push con refresh para asegurar que el servidor detecte la sesión
          router.push('/admin')
          router.refresh()
          
          // Como backup, también usar window.location después de un pequeño delay
          setTimeout(() => {
            if (window.location.pathname === '/admin/login') {
              console.log('⚠️ Redirigiendo manualmente...')
              window.location.href = '/admin'
            }
          }, 500)
        } else {
          console.error('❌ No se pudo establecer la sesión')
          setError('No se pudo establecer la sesión. Verifica que tu usuario esté confirmado en Supabase.')
          setLoading(false)
        }
      } else {
        console.error('❌ No hay usuario en la respuesta')
        setError('Error: No se recibió usuario del servidor.')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Error completo:', error)
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Inicia sesión para gestionar el blog</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00b5ff] focus:border-transparent transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00b5ff] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00b5ff] hover:bg-[#0099cc] text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

