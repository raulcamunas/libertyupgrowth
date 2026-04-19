import { redirect } from 'next/navigation'
import { getErpRoleByEmail, getErpUserOrRedirect } from '@/lib/erp/auth'
import LeadsDashboardClient from '@/components/LeadsDashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardMiniAppPage() {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  const role = getErpRoleByEmail(user.email)

  if (role !== 'admin') {
    redirect('/app')
  }

  return <LeadsDashboardClient />
}
