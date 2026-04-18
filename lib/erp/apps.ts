export type ErpApp = {
  id: string
  name: string
  description: string
  href: string
  icon: string
  badge?: string
  adminOnly?: boolean
}

export const ERP_APPS: ErpApp[] = [
  {
    id: 'home',
    name: 'Inicio',
    description: 'Dashboard principal',
    href: '/app',
    icon: 'fa-solid fa-house',
  },
]
