import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url')
)

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export async function uploadAsset(file: File, folder = 'uploads'): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot upload file.')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

  const { error } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(fileName)

  return data.publicUrl
}
