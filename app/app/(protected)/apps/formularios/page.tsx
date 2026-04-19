import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getErpUserOrRedirect, requireErpAppAccess } from '@/lib/erp/auth'
import FormSubmissionsClient from '@/components/FormSubmissionsClient'

export const dynamic = 'force-dynamic'

type FormSubmissionRow = {
  id: string
  created_at: string
  source: string | null
  ip: string | null
  user_agent: string | null
  payload: any
}

export default async function FormulariosMiniAppPage() {
  const user = await getErpUserOrRedirect(redirect, '/app/login')
  await requireErpAppAccess(redirect, user.email, 'formularios')

  const adminEmail = process.env.ERP_ADMIN_EMAIL
  const canEditSchemas = Boolean(
    adminEmail && user.email && user.email.toLowerCase() === adminEmail.toLowerCase() && user.email.toLowerCase() !== 'adrian@libertyupgrowth.com'
  )

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('form_submissions')
    .select('id, created_at, source, ip, user_agent, payload')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return (
      <div className="erp-miniapp">
        <div className="erp-miniapp-card">
          <div className="erp-miniapp-title">Formularios</div>
          <div className="erp-miniapp-subtitle">Env\u00edos capturados del onboarding</div>
          <div className="erp-miniapp-empty">No se ha podido cargar: {error.message}</div>
        </div>
      </div>
    )
  }

  return <FormSubmissionsClient submissions={(data || []) as FormSubmissionRow[]} canEditSchemas={canEditSchemas} />
}
