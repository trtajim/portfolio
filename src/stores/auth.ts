import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  async function checkSession() {
    if (!isSupabaseConfigured) {
      initialized.value = true
      return
    }

    try {
      loading.value = true
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
      initialized.value = true
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set environment variables.')
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    return data
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    user.value = null
  }

  return {
    user,
    loading,
    initialized,
    checkSession,
    signIn,
    signOut
  }
})
