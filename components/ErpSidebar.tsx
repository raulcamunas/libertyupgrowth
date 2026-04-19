'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ERP_APPS } from '@/lib/erp/apps'
import Image from 'next/image'

export default function ErpSidebar({
  role,
}: {
  role: 'admin' | 'user'
}) {
  const pathname = usePathname()

  const visible = ERP_APPS.filter((a) => (a.adminOnly ? role === 'admin' : true))

  return (
    <aside className="erp-sidebar">
      <div className="erp-sidebar-top">
        <div className="erp-brand">
          <Image src="/logo.png" alt="Liberty Seller" width={22} height={22} className="erp-brand-logo" />
          <div className="erp-brand-name">Liberty Seller</div>
        </div>
      </div>

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
