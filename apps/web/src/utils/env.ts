function readEnv(name: string): string | undefined {
  const value = import.meta.env[name]
  if (!value || typeof value !== 'string' || value.includes('your-')) return undefined
  return value.trim()
}

export function getSupabaseUrl(): string {
  const url = readEnv('VITE_SUPABASE_URL')
  if (!url) {
    throw new Error('Missing VITE_SUPABASE_URL')
  }
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

/** Publishable (sb_publishable_...) ou Legacy anon (eyJ...). */
export function getSupabaseAnonKey(): string {
  const key =
    readEnv('VITE_SUPABASE_ANON_KEY') ?? readEnv('VITE_SUPABASE_PUBLISHABLE_KEY')
  if (!key) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY')
  }
  return key
}

export function isSupabaseConfigured(): boolean {
  try {
    getSupabaseUrl()
    getSupabaseAnonKey()
    return true
  } catch {
    return false
  }
}
