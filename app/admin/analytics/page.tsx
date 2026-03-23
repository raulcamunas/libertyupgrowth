import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAnalyticsStats } from '@/app/actions/analytics'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Obtener estadísticas de los últimos 30 días
  const stats = await getAnalyticsStats()

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#080808] text-white">
      {/* Header Premium */}
      <header className="admin-header border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-white/[0.01] backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="admin-back-button"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-500 font-medium">Métricas y rendimiento del sitio</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="admin-secondary-button"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Volver al Dashboard
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <AnalyticsDashboard initialStats={stats} />
      </main>
    </div>
  )
}











