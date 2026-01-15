import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { processBlogContent } from '@/lib/blog-content-processor'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()

  if (error || !data) {
    return null
  }

  return data as Post
}

async function getRelatedPosts(currentPostId: string, limit: number = 3): Promise<Post[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentPostId)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  return (data as Post[]) || []
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post no encontrado | Liberty Seller',
    }
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || `Lee el artículo completo: ${post.title}`,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || `Lee el artículo completo: ${post.title}`,
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || `Lee el artículo completo: ${post.title}`,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)
  const relatedPosts = post ? await getRelatedPosts(post.id) : []

  if (!post) {
    notFound()
  }

  return (
    <div className="blog-post-page">
      <AnalyticsTracker 
        pageType="blog_post" 
        postId={post.id}
        postSlug={post.slug}
      />
      {/* Hero del Post */}
      <article className="blog-post-hero">
        <div className="blog-post-hero-content">
          <Link href="/blog" className="blog-post-back">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Volver al blog</span>
          </Link>
          
          <div className="blog-post-meta">
            <span className="blog-post-date">
              <i className="fa-solid fa-calendar"></i>
              {formatDate(post.published_at)}
            </span>
          </div>
          
          <h1 className="blog-post-title">{post.title}</h1>
          
          {post.seo_description && (
            <p className="blog-post-excerpt">{post.seo_description}</p>
          )}
        </div>
        
        {post.featured_image && (
          <div className="blog-post-featured-image">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="blog-post-image"
              priority
              sizes="100vw"
            />
            <div className="blog-post-image-overlay"></div>
          </div>
        )}
      </article>

      {/* Contenido del Post */}
      <div className="blog-post-container">
        <div className="blog-post-content">
          <div 
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: processBlogContent(post.content) }}
          />
        </div>

        {/* CTA Section */}
        <div className="blog-post-cta">
          <div className="blog-post-cta-content">
            <h3 className="blog-post-cta-title">¿Listo para escalar tu cuenta de Amazon?</h3>
            <p className="blog-post-cta-text">
              Contacta con nosotros y descubre cómo podemos ayudarte a alcanzar tus objetivos.
            </p>
            <Link href="/#hero" className="blog-post-cta-button">
              <span>Empezar Ahora</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Artículos Relacionados */}
        {relatedPosts.length > 0 && (
          <section className="blog-related-section">
            <h2 className="blog-related-title">Artículos Relacionados</h2>
            <div className="blog-related-grid">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="blog-related-card"
                >
                  {relatedPost.featured_image && (
                    <div className="blog-related-image-wrapper">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        fill
                        className="blog-related-image"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="blog-related-content">
                    <h3 className="blog-related-card-title">{relatedPost.title}</h3>
                    {relatedPost.seo_description && (
                      <p className="blog-related-card-excerpt">
                        {relatedPost.seo_description.substring(0, 120)}...
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

