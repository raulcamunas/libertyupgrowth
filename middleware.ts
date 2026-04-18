import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si Supabase no está configurado (por ejemplo, en un deploy nuevo de Vercel),
  // no intentes inicializar el cliente en el middleware.
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refrescar la sesión - esto es importante para mantener la sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si está intentando acceder a /admin y no está autenticado, redirigir a login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Si está intentando acceder a /app y no está autenticado, redirigir a login
  if (request.nextUrl.pathname.startsWith('/app') && !request.nextUrl.pathname.startsWith('/app/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/app/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/app/:path*',
  ],
}

