import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import BlogCountdown from '@/components/BlogCountdown'

export const metadata: Metadata = {
  title: 'Blog - Automatización con IA para negocios | Liberty UpGrowth',
  description:
    'Estrategias, guías y casos reales para automatizar atención, conversión y agenda con IA (WhatsApp + integraciones + dashboard).',
  openGraph: {
    title: 'Blog - Automatización con IA | Liberty UpGrowth',
    description: 'Estrategias y guías para automatizar tu negocio con IA.',
    type: 'website',
  },
}

async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return (data as Post[]) || []
}

async function getNextScheduledPost(): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'scheduled')
    .gte('published_at', new Date().toISOString())
    .order('published_at', { ascending: true })
    .limit(1)

  if (error) {
    console.error('Error fetching scheduled post:', error)
    return null
  }

  return (data && data.length > 0) ? (data[0] as Post) : null
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const nextScheduledPost = await getNextScheduledPost()

  return (
    <div className="blog-page">
      <AnalyticsTracker pageType="blog" />
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="blog-hero-title">Blog Liberty UpGrowth</h1>
          <p className="blog-hero-subtitle">
            Estrategias, guías y casos de éxito para automatizar tu negocio con IA
          </p>
        </div>
      </div>

      <div className="blog-container">
        {posts.length === 0 && !nextScheduledPost ? (
          <div className="blog-empty">
            <div className="blog-empty-content">
              <i className="fa-solid fa-newspaper"></i>
              <h2>Próximamente</h2>
              <p>Estamos preparando contenido de valor para ti. Vuelve pronto.</p>
            </div>
          </div>
        ) : (
          <div className="blog-grid">
            {/* Post programado bloqueado */}
            {nextScheduledPost && (
              <article key={nextScheduledPost.id} className="blog-card blog-card-upcoming">
                <div className="blog-card-link blog-card-blocked">
                  {nextScheduledPost.featured_image && (
                    <div className="blog-card-image-wrapper">
                      <Image
                        src={nextScheduledPost.featured_image}
                        alt={nextScheduledPost.title}
                        fill
                        className="blog-card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="blog-card-overlay blog-card-overlay-blocked"></div>
                      <div className="blog-card-lock-overlay">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                    </div>
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-card-upcoming-label">
                        <i className="fa-solid fa-clock"></i>
                        Próximamente en:
                      </span>
                      {nextScheduledPost.published_at && (
                        <BlogCountdown publishedAt={nextScheduledPost.published_at} />
                      )}
                    </div>
                    <h2 className="blog-card-title">{nextScheduledPost.title}</h2>
                    {nextScheduledPost.seo_description && (
                      <p className="blog-card-excerpt">{nextScheduledPost.seo_description}</p>
                    )}
                    <div className="blog-card-footer">
                      <span className="blog-card-read-more blog-card-read-more-blocked">
                        Disponible próximamente
                        <i className="fa-solid fa-lock"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Posts publicados */}
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <Link href={`/blog/${post.slug}`} className="blog-card-link">
                  {post.featured_image && (
                    <div className="blog-card-image-wrapper">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="blog-card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="blog-card-overlay"></div>
                    </div>
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        <i className="fa-solid fa-calendar"></i>
                        {formatDate(post.published_at)}
                      </span>
                      {post.reading_time && (
                        <span className="blog-card-reading-time">
                          <i className="fa-solid fa-clock"></i>
                          {post.reading_time} min
                        </span>
                      )}
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    {post.seo_description && (
                      <p className="blog-card-excerpt">{post.seo_description}</p>
                    )}
                    <div className="blog-card-footer">
                      <span className="blog-card-read-more">
                        Leer más
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

