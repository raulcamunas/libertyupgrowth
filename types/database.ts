export type PostStatus = 'draft' | 'published' | 'scheduled'

export interface Post {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  content: string
  featured_image: string | null
  author: string
  status: PostStatus
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  reading_time: number | null
  user_id: string
}

export interface PostInsert {
  title: string
  slug: string
  content: string
  featured_image?: string | null
  author: string
  status?: PostStatus
  published_at?: string | null
  seo_title?: string | null
  seo_description?: string | null
  reading_time?: number | null
}

export interface PostUpdate extends Partial<PostInsert> {
  updated_at?: string
}

