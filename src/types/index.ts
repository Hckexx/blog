export interface Post {
  id: string
  title: string
  slug: string
  subtitle: string | null
  excerpt: string | null
  content: string
  cover_image: string | null
  category_id: string | null
  status: 'draft' | 'published'
  display_date: string
  display_date_mode: 'live' | 'manual'
  published_at: string | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
  category?: Category | null
  tags?: Tag[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Media {
  id: string
  file_name: string
  url: string
  alt_text: string | null
  size: number
  uploaded_at: string
}

export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
}

export interface SiteSettings {
  [key: string]: string
}