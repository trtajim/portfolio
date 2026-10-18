export interface GroupedStack {
  category: string
  items: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface SiteStat {
  label: string
  value: string
}

export interface Profile {
  id?: string
  name: string
  headline: string
  whoami: string[]
  main_stack: string[]
  grouped_stacks: GroupedStack[]
  social_links: SocialLink[]
  stats?: SiteStat[]
  avatar_url?: string | null
  updated_at?: string
}

export interface ProjectAction {
  label: string
  url: string
}

export interface Project {
  id?: string
  slug: string
  title: string
  summary: string
  pill: string
  top_metric?: string | null
  tags: string[]
  actions: ProjectAction[]
  content?: string
  image_url?: string | null
  is_featured: boolean
  is_published: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface Post {
  id?: string
  slug: string
  title: string
  subtitle?: string | null
  content: string
  tags: string[]
  image_url?: string | null
  is_featured: boolean
  is_published: boolean
  published_date: string
  created_at?: string
  updated_at?: string
}

export type ShortPlatform = 'youtube' | 'facebook'

export interface Short {
  id?: string
  title: string
  platform: ShortPlatform
  video_url: string
  thumbnail_url?: string | null
  is_published: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}
