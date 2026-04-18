import { createClient } from '@/lib/supabase/server'

export type ErpRole = 'admin' | 'user'

export async function getErpUserOrRedirect(redirect: (url: string) => never, to: string = '/app/login') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(to)
  return user
}

export function getErpRoleByEmail(email?: string | null): ErpRole {
  const adminEmail = process.env.ERP_ADMIN_EMAIL
  if (adminEmail && email && email.toLowerCase() === adminEmail.toLowerCase()) return 'admin'
  return 'user'
}
