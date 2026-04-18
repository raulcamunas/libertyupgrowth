import { redirect } from 'next/navigation'
import { ERP_APPS } from '@/lib/erp/apps'
import { getErpRoleByEmail, getErpUserOrRedirect } from '@/lib/erp/auth'

export const dynamic = 'force-dynamic'

export default async function ErpMiniAppPage({ params }: { params: { slug: string } }) {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  const role = getErpRoleByEmail(user.email)

  const app = ERP_APPS.find((a) => a.href === `/app/apps/${params.slug}`)

  if (!app) {
    redirect('/app')
  }

  if (app.adminOnly && role !== 'admin') {
    redirect('/app')
  }

  return (
    <div className="erp-miniapp">
      <div className="erp-miniapp-card">
        <div className="erp-miniapp-title">{app.name}</div>
        <div className="erp-miniapp-subtitle">{app.description}</div>
        <div className="erp-miniapp-empty">Mini app en construcción. Dime qué quieres montar aquí y lo implemento.</div>
      </div>
    </div>
  )
}
