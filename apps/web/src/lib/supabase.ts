import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/utils/env'

let client: SupabaseClient | null = null

/** Cliente Supabase singleton (só instancia se as env vars estiverem definidas). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return client
}
