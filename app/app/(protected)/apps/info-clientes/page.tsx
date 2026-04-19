import { redirect } from 'next/navigation'
import { getErpUserOrRedirect } from '@/lib/erp/auth'
import ClientsInfoClient from '@/components/ClientsInfoClient'

export const dynamic = 'force-dynamic'

export default async function InfoClientesMiniAppPage() {
  const user = await getErpUserOrRedirect(redirect, '/app/login')

  if ((user.email || '').toLowerCase() !== 'libertyupgrowth@gmail.com') {
    redirect('/app')
  }

  return <ClientsInfoClient />
}
