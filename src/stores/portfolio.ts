import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile, Project, Post, Short } from '@/types'

const defaultProfile: Profile = {
  name: 'TR Tajim',
  headline: 'Web developer building open-source tools and lean web products.',
  whoami: [
    'I’m TR Tajim, a full-stack developer, competitive programmer and IoT enthusiast. I build web applications, Android apps and developer-focused projects.',
    'I mainly work with Laravel, Vue.js, React, PHP, Java and C++. I’m also part of HSCStack, an open-source community project for HSC and SSC students.'
  ],
  grouped_stacks: [
    { category: 'Web', items: 'Laravel, PHP, Vue.js, React.js, MySQL' },
    { category: 'Mobile', items: 'Java, Android SDK, XML' },
    { category: 'Programming', items: 'C, C++' },
    { category: 'IoT', items: 'Arduino, IoT integration' },
    { category: 'DevOps', items: 'Linux, Bash, cPanel' }
  ],
  social_links: [
    { label: 'GitHub', url: 'https://github.com/trtajim' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/trtajim' },
    { label: 'Facebook', url: 'https://facebook.com/trtajim' }
  ],
  stats: [
    { label: 'years building', value: '4+' },
    { label: 'projects shipped', value: '15+' }
  ],
  avatar_url: null
}

const defaultProjects: Project[] = [
  {
    id: '1',
    slug: 'hscstack',
    title: 'HSCStack',
    summary:
      'A community-driven website and Facebook page for HSC and SSC students, offering organised study material. Built and maintained in the open by contributors.',
    pill: 'Web',
    top_metric: '1,000+ registered users',
    tags: ['Open source', 'Education', 'Community'],
    actions: [
      { label: 'Visit site', url: 'https://hscstack.com' },
      { label: 'GitHub', url: 'https://github.com/hscstack' }
    ],
    content: `# HSCStack\n\nA platform simplifying study material access for students across Bangladesh.\n\n### Tech Stack\n- Laravel backend\n- Vue.js reactive components\n- MySQL & Redis caching`,
    image_url: null,
    is_featured: true,
    is_published: true,
    order_index: 0
  },
  {
    id: '2',
    slug: 'mesh-iot-monitor',
    title: 'Mesh IoT Environmental Monitor',
    summary:
      'Low-power sensor nodes transmitting temperature and humidity data over ESP-NOW mesh network with a central dashboard.',
    pill: 'IoT',
    top_metric: null,
    tags: ['Arduino', 'C++', 'ESP-NOW', 'Hardware'],
    actions: [
      { label: 'GitHub', url: 'https://github.com/trtajim/iot-monitor' },
      { label: 'Demo video', url: 'https://youtube.com' }
    ],
    content: `# Mesh IoT Environmental Monitor\n\nHardware design and embedded firmware for continuous telemetry.`,
    image_url: null,
    is_featured: true,
    is_published: true,
    order_index: 1
  }
]

const defaultPosts: Post[] = [
  {
    id: '1',
    slug: 'building-a-store-without-paying-for-hosting',
    title: 'Building a store without paying for hosting',
    subtitle: 'What a free-tier-only stack can and cannot do.',
    content: `# Building a store without paying for hosting\n\nWhat a free-tier-only stack can and cannot do.\n\n### The Setup\nDeploying modern static frontends with serverless backends enables virtually zero-cost operations during early-stage validation.`,
    tags: ['Architecture', 'Cloud', 'Cost-optimization'],
    image_url: null,
    is_featured: true,
    is_published: true,
    published_date: '2026-08-14'
  },
  {
    id: '2',
    slug: 'debugging-esp32-mesh-networks',
    title: 'Debugging ESP32 mesh networks in practice',
    subtitle: 'Lessons learned from packet drops and battery optimization.',
    content: `# Debugging ESP32 mesh networks in practice\n\nPractical tips on handling dropped packets and sleep modes in remote node deployments.`,
    tags: ['IoT', 'Embedded', 'C++'],
    image_url: null,
    is_featured: true,
    is_published: true,
    published_date: '2026-07-22'
  }
]

const defaultShorts: Short[] = [
  {
    id: '1',
    title: 'Motion Design Reel',
    platform: 'youtube',
    video_url: 'https://www.youtube.com/shorts/KTHWFWPpukc',
    thumbnail_url: null,
    is_published: true,
    order_index: 0
  },
  {
    id: '2',
    title: 'Product UI Motion Demo',
    platform: 'facebook',
    video_url: 'https://www.facebook.com/reel/29151614751128890',
    thumbnail_url: null,
    is_published: true,
    order_index: 1
  },
  {
    id: '3',
    title: 'Feature Showcase Reel',
    platform: 'facebook',
    video_url: 'https://www.facebook.com/reel/1669477794769453',
    thumbnail_url: null,
    is_published: true,
    order_index: 2
  }
]

export const usePortfolioStore = defineStore('portfolio', () => {
  const profile = ref<Profile>({ ...defaultProfile })
  const projects = ref<Project[]>([...defaultProjects])
  const posts = ref<Post[]>([...defaultPosts])
  const shorts = ref<Short[]>([...defaultShorts])

  const loading = ref(false)
  const isLoaded = ref(false)
  const lastFetched = ref<number>(0)
  const CACHE_TTL_MS = 3 * 60 * 1000

  async function fetchAll(force = false) {
    const now = Date.now()
    if (!force && isLoaded.value && now - lastFetched.value < CACHE_TTL_MS) {
      return
    }

    if (!isSupabaseConfigured) {
      isLoaded.value = true
      lastFetched.value = now
      return
    }

    try {
      loading.value = true

      const [profileRes, projectsRes, postsRes, shortsRes] = await Promise.all([
        supabase.from('profile').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('order_index', { ascending: true }),
        supabase.from('posts').select('*').order('published_date', { ascending: false }),
        supabase.from('shorts').select('*').order('order_index', { ascending: true })
      ])

      if (profileRes.data) {
        profile.value = {
          ...profileRes.data,
          whoami: Array.isArray(profileRes.data.whoami)
            ? profileRes.data.whoami
            : defaultProfile.whoami,
          grouped_stacks: Array.isArray(profileRes.data.grouped_stacks)
            ? profileRes.data.grouped_stacks
            : defaultProfile.grouped_stacks,
          social_links: Array.isArray(profileRes.data.social_links)
            ? profileRes.data.social_links
            : defaultProfile.social_links
        }
      }

      if (projectsRes.data && projectsRes.data.length > 0) {
        projects.value = projectsRes.data
      }

      if (postsRes.data && postsRes.data.length > 0) {
        posts.value = postsRes.data
      }

      if (shortsRes.data && shortsRes.data.length > 0) {
        shorts.value = shortsRes.data
      }

      isLoaded.value = true
      lastFetched.value = now
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function invalidateCache() {
    isLoaded.value = false
    lastFetched.value = 0
  }

  async function updateProfile(updated: Partial<Profile>) {
    if (!isSupabaseConfigured) {
      profile.value = { ...profile.value, ...updated }
      return
    }

    if (profile.value.id) {
      const { error } = await supabase
        .from('profile')
        .update(updated)
        .eq('id', profile.value.id)
      if (error) throw error
    } else {
      const { data, error } = await supabase.from('profile').insert([updated]).select().single()
      if (error) throw error
      profile.value = data
    }
    invalidateCache()
    await fetchAll(true)
  }

  async function saveProject(project: Partial<Project>) {
    if (!isSupabaseConfigured) {
      if (project.id) {
        const idx = projects.value.findIndex((p) => p.id === project.id)
        if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...project } as Project
      } else {
        projects.value.push({
          ...project,
          id: String(Date.now()),
          created_at: new Date().toISOString()
        } as Project)
      }
      return
    }

    if (project.id) {
      const { error } = await supabase.from('projects').update(project).eq('id', project.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('projects').insert([project])
      if (error) throw error
    }
    invalidateCache()
    await fetchAll(true)
  }

  async function deleteProject(id: string) {
    if (!isSupabaseConfigured) {
      projects.value = projects.value.filter((p) => p.id !== id)
      return
    }
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    invalidateCache()
    await fetchAll(true)
  }

  async function savePost(post: Partial<Post>) {
    if (!isSupabaseConfigured) {
      if (post.id) {
        const idx = posts.value.findIndex((p) => p.id === post.id)
        if (idx !== -1) posts.value[idx] = { ...posts.value[idx], ...post } as Post
      } else {
        posts.value.unshift({
          ...post,
          id: String(Date.now()),
          created_at: new Date().toISOString()
        } as Post)
      }
      return
    }

    if (post.id) {
      const { error } = await supabase.from('posts').update(post).eq('id', post.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('posts').insert([post])
      if (error) throw error
    }
    invalidateCache()
    await fetchAll(true)
  }

  async function deletePost(id: string) {
    if (!isSupabaseConfigured) {
      posts.value = posts.value.filter((p) => p.id !== id)
      return
    }
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
    invalidateCache()
    await fetchAll(true)
  }

  async function saveShort(short: Partial<Short>) {
    if (!isSupabaseConfigured) {
      if (short.id) {
        const idx = shorts.value.findIndex((s) => s.id === short.id)
        if (idx !== -1) shorts.value[idx] = { ...shorts.value[idx], ...short } as Short
      } else {
        shorts.value.push({
          ...short,
          id: String(Date.now()),
          created_at: new Date().toISOString()
        } as Short)
      }
      return
    }

    if (short.id) {
      const { error } = await supabase.from('shorts').update(short).eq('id', short.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('shorts').insert([short])
      if (error) throw error
    }
    invalidateCache()
    await fetchAll(true)
  }

  async function deleteShort(id: string) {
    if (!isSupabaseConfigured) {
      shorts.value = shorts.value.filter((s) => s.id !== id)
      return
    }
    const { error } = await supabase.from('shorts').delete().eq('id', id)
    if (error) throw error
    invalidateCache()
    await fetchAll(true)
  }

  function subscribeRealtime() {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, () => {
        fetchAll(true)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchAll(true)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchAll(true)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shorts' }, () => {
        fetchAll(true)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  return {
    profile,
    projects,
    posts,
    shorts,
    loading,
    isLoaded,
    fetchAll,
    invalidateCache,
    subscribeRealtime,
    updateProfile,
    saveProject,
    deleteProject,
    savePost,
    deletePost,
    saveShort,
    deleteShort
  }
})

