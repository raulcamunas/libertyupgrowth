export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // El layout no redirige aquí, cada página maneja su propia autenticación
  // Esto permite que /admin/login sea accesible sin autenticación
  return <>{children}</>
}

