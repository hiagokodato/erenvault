function requireEnv(name: string): string {
  const value = import.meta.env[name]
  if (!value || typeof value !== 'string') {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export function getSupabaseUrl(): string {
  return requireEnv('VITE_SUPABASE_URL')
}

export function getSupabaseAnonKey(): string {
  return requireEnv('VITE_SUPABASE_ANON_KEY')
}

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return Boolean(url && key && typeof url === 'string' && typeof key === 'string')
}
