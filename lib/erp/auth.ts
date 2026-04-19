import { createClient } from '@/lib/supabase/server'
import { ERP_APPS } from '@/lib/erp/apps'

export type ErpRole = 'admin' | 'user'

export type ErpPermissions = {
  role: ErpRole
  allowedAppIds: string[]
}

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

export async function getErpPermissionsByEmail(email?: string | null): Promise<ErpPermissions> {
  const role = getErpRoleByEmail(email)
  if (role === 'admin') {
    return { role, allowedAppIds: ERP_APPS.map((a) => a.id) }
  }

  if (!email) return { role: 'user', allowedAppIds: [] }

  const supabase = await createClient()
  const { data } = await supabase
    .from('erp_user_permissions')
    .select('allowed_app_ids')
    .eq('email', email)
    .maybeSingle()

  const allowed = Array.isArray((data as any)?.allowed_app_ids) ? ((data as any).allowed_app_ids as string[]) : []
  return { role, allowedAppIds: allowed }
}

export async function requireErpAppAccess(
  redirect: (url: string) => never,
  email: string | null | undefined,
  appId: string
) {
  const perms = await getErpPermissionsByEmail(email)
  if (perms.role === 'admin') return perms
  if (!perms.allowedAppIds.includes(appId)) redirect('/app')
  return perms
}
