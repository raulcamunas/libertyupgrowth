import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export const metadata: Metadata = {
  title: 'Blog - Estrategias y Consejos para Amazon FBA | Liberty Seller',
  description: 'Descubre las últimas estrategias, consejos y casos de éxito para optimizar tu cuenta de Amazon FBA. Aprende de los expertos.',
  openGraph: {
    title: 'Blog - Estrategias Amazon FBA | Liberty Seller',
    description: 'Descubre las últimas estrategias y consejos para optimizar tu cuenta de Amazon FBA.',
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

  return (
    <div className="blog-page">
      <AnalyticsTracker pageType="blog" />
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="blog-hero-title">Blog Liberty Seller</h1>
          <p className="blog-hero-subtitle">
            Estrategias, consejos y casos de éxito para escalar tu negocio en Amazon FBA
          </p>
        </div>
      </div>

      <div className="blog-container">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-content">
              <i className="fa-solid fa-newspaper"></i>
              <h2>Próximamente</h2>
              <p>Estamos preparando contenido de valor para ti. Vuelve pronto.</p>
            </div>
          </div>
        ) : (
          <div className="blog-grid">
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

