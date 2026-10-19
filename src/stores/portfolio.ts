import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile, Project, Post, Short } from '@/types'

const emptyProfile: Profile = {
  name: '',
  headline: '',
  whoami: [],
  grouped_stacks: [],
  social_links: [],
  stats: [],
  avatar_url: null
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const profile = ref<Profile>({ ...emptyProfile })
  const projects = ref<Project[]>([])
  const posts = ref<Post[]>([])
  const shorts = ref<Short[]>([])

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
            : [],
          grouped_stacks: Array.isArray(profileRes.data.grouped_stacks)
            ? profileRes.data.grouped_stacks
            : [],
          social_links: Array.isArray(profileRes.data.social_links)
            ? profileRes.data.social_links
            : []
        }
      }

      if (projectsRes.data) {
        projects.value = projectsRes.data
      }

      if (postsRes.data) {
        posts.value = postsRes.data
      }

      if (shortsRes.data) {
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

