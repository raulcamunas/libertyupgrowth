import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ERP_APPS } from '@/lib/erp/apps'
import { getErpRoleByEmail, getErpUserOrRedirect } from '@/lib/erp/auth'

export const dynamic = 'force-dynamic'

export default async function ErpHomePage() {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  const role = getErpRoleByEmail(user.email)

  const visible = ERP_APPS.filter((a) => (a.adminOnly ? role === 'admin' : true)).filter((a) => a.id !== 'home')

  if (visible.length === 0) {
    return (
      <div className="erp-grid-wrap">
        <div className="erp-empty">
          <div className="erp-empty-title">No hay apps instaladas</div>
          <div className="erp-empty-subtitle">Añade nuevas mini-apps en `lib/erp/apps.ts` para que aparezcan aquí.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="erp-grid-wrap">
      <div className="erp-grid">
        {visible.map((app) => (
          <Link key={app.id} href={app.href} className="erp-app-card">
            <div className="erp-app-card-top">
              <div className="erp-app-icon">
                <i className={app.icon} />
              </div>
              <div className="erp-app-dot" />
            </div>
            <div className="erp-app-name">{app.name}</div>
            <div className="erp-app-desc">{app.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
