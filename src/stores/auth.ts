import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isGuest = ref(false)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value || isGuest.value))
  const canEdit = computed(() => Boolean(user.value && !isGuest.value))

  async function checkSession() {
    if (sessionStorage.getItem('portfolio_guest_mode') === 'true') {
      isGuest.value = true
    }

    if (!isSupabaseConfigured.value) {
      initialized.value = true
      return
    }

    try {
      loading.value = true
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
      if (user.value) {
        isGuest.value = false
        sessionStorage.removeItem('portfolio_guest_mode')
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
      initialized.value = true
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (user.value) {
        isGuest.value = false
        sessionStorage.removeItem('portfolio_guest_mode')
      }
    })
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured.value) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    isGuest.value = false
    sessionStorage.removeItem('portfolio_guest_mode')
    return data
  }

  function signInAsGuest() {
    isGuest.value = true
    user.value = null
    sessionStorage.setItem('portfolio_guest_mode', 'true')
  }

  async function signOut() {
    if (isSupabaseConfigured.value) {
      await supabase.auth.signOut()
    }
    user.value = null
    isGuest.value = false
    sessionStorage.removeItem('portfolio_guest_mode')
  }

  return {
    user,
    isGuest,
    isAuthenticated,
    canEdit,
    loading,
    initialized,
    checkSession,
    signIn,
    signInAsGuest,
    signOut
  }
})
