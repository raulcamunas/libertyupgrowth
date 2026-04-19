import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getErpUserOrRedirect } from '@/lib/erp/auth'
import LeadsClient from '@/components/LeadsClient'

export const dynamic = 'force-dynamic'

type LeadRow = {
  id: string
  created_at: string
  lead_key: string | null
  source: string | null
  name: string | null
  email: string | null
  phone: string | null
  status: string | null
  adset_name: string | null
  pain_point: string | null
  current_situation: string | null
  notes: string | null
  payload: any
}

export default async function LeadsMiniAppPage() {
  await getErpUserOrRedirect(redirect, '/app/login')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) {
    return (
      <div className="erp-miniapp">
        <div className="erp-miniapp-card">
          <div className="erp-miniapp-title">Leads</div>
          <div className="erp-miniapp-subtitle">Entradas desde Sheets, Meta, etc.</div>
          <div className="erp-miniapp-empty">No se ha podido cargar: {error.message}</div>
        </div>
      </div>
    )
  }

  return <LeadsClient leads={(data || []) as LeadRow[]} />
}
