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
    id: 'crm-leads-web',
    name: 'CRM Leads Web',
    description: 'Leads desde tu sitio web',
    href: '/app/apps/crm-leads-web',
    icon: 'fa-solid fa-globe',
    badge: '12',
  },
  {
    id: 'linkedin-prospeccion',
    name: 'LinkedIn Prospección',
    description: 'Gestión de prospección ABM en LinkedIn',
    href: '/app/apps/linkedin-prospeccion',
    icon: 'fa-brands fa-linkedin',
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    description: 'Control financiero y facturación',
    href: '/app/apps/finanzas',
    icon: 'fa-solid fa-dollar-sign',
  },
  {
    id: 'comisiones',
    name: 'Comisiones',
    description: 'Calculadora de comisiones y liquidaciones',
    href: '/app/apps/comisiones',
    icon: 'fa-solid fa-coins',
  },
  {
    id: 'gestion-usuarios',
    name: 'Gestión de Usuarios',
    description: 'Crea y gestiona usuarios del sistema',
    href: '/app/apps/gestion-usuarios',
    icon: 'fa-solid fa-users',
    adminOnly: true,
  },
  {
    id: 'ppc-agency-hub',
    name: 'PPC Agency Hub',
    description: 'Gestión de clientes y campañas PPC',
    href: '/app/apps/ppc-agency-hub',
    icon: 'fa-solid fa-bullseye',
  },
  {
    id: 'employee-tracker',
    name: 'Employee Tracker',
    description: 'Seguimiento de actividad de empleados',
    href: '/app/apps/employee-tracker',
    icon: 'fa-solid fa-chart-line',
  },
  {
    id: 'subir-horas',
    name: 'Subir Horas',
    description: 'Subir horas de trabajo desde CSV',
    href: '/app/apps/subir-horas',
    icon: 'fa-solid fa-upload',
  },
  {
    id: 'usos-horarios',
    name: 'Usos horarios',
    description: 'Zonas: México y España',
    href: '/app/apps/usos-horarios',
    icon: 'fa-solid fa-clock',
  },
  {
    id: 'canvas-clientes',
    name: 'Canvas Clientes',
    description: 'Gestión de clientes tipo Notion con tareas',
    href: '/app/apps/canvas-clientes',
    icon: 'fa-solid fa-table-columns',
  },
  {
    id: 'validador-fba',
    name: 'Validador FBA',
    description: 'Validación de rentabilidad de productos',
    href: '/app/apps/validador-fba',
    icon: 'fa-solid fa-check',
  },
  {
    id: 'sales-auditor',
    name: 'Sales Auditor',
    description: 'Auditoría estratégica de cuentas',
    href: '/app/apps/sales-auditor',
    icon: 'fa-solid fa-magnifying-glass',
  },
]
