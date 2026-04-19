import { redirect } from 'next/navigation'
import { getErpPermissionsByEmail, getErpUserOrRedirect } from '@/lib/erp/auth'
import ErpSidebar from '@/components/ErpSidebar'
import LogoutButton from '@/components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  const perms = await getErpPermissionsByEmail(user.email)

  return (
    <div className="erp-shell">
      <ErpSidebar role={perms.role} allowedAppIds={perms.allowedAppIds} />
      <div className="erp-main">
        <header className="erp-topbar">
          <div className="erp-topbar-left">
            <div className="erp-sidebar-bottom">
              <div className="erp-role">{perms.role === 'admin' ? 'Admin' : 'Usuario'}</div>
            </div>
            <div className="erp-topbar-subtitle">Selecciona una aplicación para comenzar</div>
          </div>
          <div className="erp-topbar-right">
            <div className="erp-user">
              <div className="erp-user-label">Conectado como</div>
              <div className="erp-user-email">{user.email}</div>
            </div>
            <LogoutButton redirectTo="/app/login" />
          </div>
        </header>
        <main className="erp-content">{children}</main>
      </div>
    </div>
  )
}
