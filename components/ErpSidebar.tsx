'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ERP_APPS } from '@/lib/erp/apps'

export default function ErpSidebar({
  role,
  allowedAppIds,
}: {
  role: 'admin' | 'user'
  allowedAppIds: string[]
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const v = window.localStorage.getItem('erp_sidebar_collapsed')
      const next = v === '1'
      setCollapsed(next)
      document.documentElement.classList.toggle('erp-sidebar-collapsed', next)
    } catch {
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('erp_sidebar_collapsed', collapsed ? '1' : '0')
      document.documentElement.classList.toggle('erp-sidebar-collapsed', collapsed)
    } catch {
    }
  }, [collapsed])

  const visible = ERP_APPS.filter((a) => (a.adminOnly ? role === 'admin' : true)).filter((a) => a.id === 'home' || allowedAppIds.includes(a.id))

  return (
    <aside className="erp-sidebar">
      <button
        type="button"
        className="erp-sidebar-toggle"
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        title={collapsed ? 'Expandir' : 'Contraer'}
      >
        <i className={collapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'} />
      </button>
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
