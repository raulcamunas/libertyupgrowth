'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LogoutButton({ redirectTo = '/admin/login' }: { redirectTo?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="admin-logout-button"
    >
      {loading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          Cerrando...
        </>
      ) : (
        <>
          <i className="fa-solid fa-sign-out-alt mr-2"></i>
          Cerrar Sesión
        </>
      )}
    </button>
  )
}

