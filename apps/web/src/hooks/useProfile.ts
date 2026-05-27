import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/context/useAuth'
import { getSupabase } from '@/lib/supabase'
import type { UserProfile } from '@erenvault/types'
import type { Database } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export function useProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<UserProfile | null> => {
      const supabase = getSupabase()
      if (!supabase || !user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const row = data as ProfileRow

      return {
        id: row.id,
        displayName: row.display_name,
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    },
  })
}
