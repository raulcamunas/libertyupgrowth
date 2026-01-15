import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Post } from '@/types/database'
import LogoutButton from '@/components/LogoutButton'

async function getPosts() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return (data as Post[]) || []
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const posts = await getPosts()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'draft':
        return 'Borrador'
      case 'scheduled':
        return 'Programado'
      default:
        return status
    }
  }

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#080808] text-white">
      {/* Header Premium */}
      <header className="admin-header border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-white/[0.01] backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                Content Studio
              </h1>
              <p className="text-sm text-gray-500 font-medium">Gestiona tu contenido con estilo</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Conectado como</p>
                <p className="text-sm font-medium text-gray-300">{user.email}</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="admin-stat-card">
            <div className="admin-stat-icon bg-blue-500/20 text-blue-400">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <div>
              <p className="admin-stat-value">{stats.total}</p>
              <p className="admin-stat-label">Total Posts</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon bg-green-500/20 text-green-400">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <div>
              <p className="admin-stat-value">{stats.published}</p>
              <p className="admin-stat-label">Publicados</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon bg-yellow-500/20 text-yellow-400">
              <i className="fa-solid fa-edit"></i>
            </div>
            <div>
              <p className="admin-stat-value">{stats.draft}</p>
              <p className="admin-stat-label">Borradores</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon bg-purple-500/20 text-purple-400">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <p className="admin-stat-value">{stats.scheduled}</p>
              <p className="admin-stat-label">Programados</p>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Todos los Posts</h2>
            <p className="text-sm text-gray-500">Gestiona y edita tu contenido</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/analytics"
              className="admin-secondary-button group"
            >
              <i className="fa-solid fa-chart-line mr-2"></i>
              Analytics
            </Link>
            <Link
              href="/admin/posts/new"
              className="admin-primary-button group"
            >
              <i className="fa-solid fa-plus mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
              Nuevo Post
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <i className="fa-solid fa-pen-nib"></i>
            </div>
            <h3 className="admin-empty-title">Comienza a crear contenido</h3>
            <p className="admin-empty-text">Aún no tienes posts. Crea tu primer artículo y comparte tu conocimiento.</p>
            <Link
              href="/admin/posts/new"
              className="admin-primary-button mt-6"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Crear tu primer post
            </Link>
          </div>
        ) : (
          <div className="admin-posts-grid">
            {posts.map((post) => (
              <div
                key={post.id}
                className="admin-post-card group"
              >
                <div className="admin-post-card-header">
                  <div className="flex-1 min-w-0">
                    <h3 className="admin-post-title">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`admin-status-badge ${getStatusColor(post.status)}`}>
                        <span className="admin-status-dot"></span>
                        {getStatusLabel(post.status)}
                      </span>
                      <span className="admin-post-date">
                        <i className="fa-solid fa-calendar text-xs mr-1.5"></i>
                        {new Date(post.created_at).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="admin-post-card-footer">
                  <div className="admin-post-slug">
                    <i className="fa-solid fa-link text-xs mr-1.5"></i>
                    <code>/blog/{post.slug}</code>
                  </div>
                  <div className="admin-post-actions">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="admin-action-button admin-action-edit"
                      title="Editar post"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </Link>
                    {post.status === 'published' ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="admin-action-button admin-action-view"
                        title="Ver en el blog"
                      >
                        <i className="fa-solid fa-external-link"></i>
                      </Link>
                    ) : (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="admin-action-button admin-action-preview"
                        title="Vista previa"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

