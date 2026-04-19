import { redirect } from 'next/navigation'
import { getErpRoleByEmail, getErpUserOrRedirect } from '@/lib/erp/auth'
import UsersAdminClient from '@/components/UsersAdminClient'

export const dynamic = 'force-dynamic'

export default async function UsuariosMiniAppPage() {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  const role = getErpRoleByEmail(user.email)

  if (role !== 'admin') {
    redirect('/app')
  }

  return <UsersAdminClient />
}
