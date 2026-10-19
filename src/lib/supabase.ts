import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const SESSION_URL_KEY = 'session_supabase_url'
const SESSION_KEY_KEY = 'session_supabase_anon_key'

function getInitialUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL
  if (envUrl && !envUrl.includes('your-supabase-url')) return envUrl
  try {
    return sessionStorage.getItem(SESSION_URL_KEY) || ''
  } catch {
    return ''
  }
}

function getInitialKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
  if (envKey && !envKey.includes('your-supabase-publishable-key')) return envKey
  try {
    return sessionStorage.getItem(SESSION_KEY_KEY) || ''
  } catch {
    return ''
  }
}

let activeUrl = getInitialUrl()
let activeKey = getInitialKey()

export const isSupabaseConfigured = ref(Boolean(activeUrl && activeKey))

function makeClient(url: string, key: string): SupabaseClient {
  return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
}

export let supabase: SupabaseClient = makeClient(activeUrl, activeKey)

export function setSessionSupabaseCredentials(url: string, key: string) {
  const cleanUrl = url.trim().replace(/\/+$/, '')
  const cleanKey = key.trim()

  if (!cleanUrl || !cleanKey) {
    throw new Error('Both Supabase URL and Key are required.')
  }

  try {
    sessionStorage.setItem(SESSION_URL_KEY, cleanUrl)
    sessionStorage.setItem(SESSION_KEY_KEY, cleanKey)
  } catch (err) {
    console.warn('Could not write to sessionStorage:', err)
  }

  activeUrl = cleanUrl
  activeKey = cleanKey
  supabase = makeClient(cleanUrl, cleanKey)
  isSupabaseConfigured.value = true
}

export function clearSessionSupabaseCredentials() {
  try {
    sessionStorage.removeItem(SESSION_URL_KEY)
    sessionStorage.removeItem(SESSION_KEY_KEY)
  } catch {}

  activeUrl = ''
  activeKey = ''
  isSupabaseConfigured.value = false
  supabase = makeClient('', '')
}

export async function uploadAsset(file: File, folder = 'uploads'): Promise<string> {
  if (!isSupabaseConfigured.value) {
    throw new Error('Supabase is not configured. Cannot upload file.')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'portfolio'

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return data.publicUrl
}
