'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ERP_APPS } from '@/lib/erp/apps'

export default function ErpSidebar({
  role,
  allowedAppIds,
}: {
  role: 'admin' | 'user'
  allowedAppIds: string[]
}) {
  const pathname = usePathname()

  const visible = ERP_APPS.filter((a) => (a.adminOnly ? role === 'admin' : true)).filter((a) => a.id === 'home' || allowedAppIds.includes(a.id))

  return (
    <aside className="erp-sidebar">
      <nav className="erp-nav">
        {visible.map((app) => {
          const active = app.href === '/app' ? pathname === '/app' : pathname.startsWith(app.href)
          return (
            <Link
              key={app.id}
              href={app.href}
              className={active ? 'erp-nav-item erp-nav-item-active' : 'erp-nav-item'}
            >
              <i className={app.icon} />
              <span className="erp-nav-label">{app.name}</span>
              {app.badge ? <span className="erp-nav-badge">{app.badge}</span> : null}
            </Link>
          )
        })}
      </nav>

      <div className="erp-sidebar-bottom">
        <div className="erp-role">{role === 'admin' ? 'Admin' : 'Usuario'}</div>
      </div>
    </aside>
  )
}
