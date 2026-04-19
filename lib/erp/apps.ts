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
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Evolución de leads por día y fuente',
    href: '/app/apps/dashboard',
    icon: 'fa-solid fa-chart-line',
    adminOnly: true,
  },
  {
    id: 'usuarios',
    name: 'Usuarios',
    description: 'Gestión de accesos y permisos',
    href: '/app/apps/usuarios',
    icon: 'fa-solid fa-user-shield',
    adminOnly: true,
  },
  {
    id: 'leads',
    name: 'Leads',
    description: 'Leads entrantes (Sheets, Meta, etc.)',
    href: '/app/apps/leads',
    icon: 'fa-solid fa-user-plus',
  },
  {
    id: 'formularios',
    name: 'Formularios',
    description: 'Envíos y respuestas capturadas del onboarding',
    href: '/app/apps/formularios',
    icon: 'fa-solid fa-clipboard-list',
  },
]
