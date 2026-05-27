import { useQuery } from '@tanstack/react-query'

import { ensureDefaultCategories, fetchCategories } from '@/features/categories/api/categories'
import { categoryKeys } from '@/features/transactions/queryKeys'
import { useAuth } from '@/features/auth/context/useAuth'

export function useCategories() {
  const { user } = useAuth()

  return useQuery({
    queryKey: categoryKeys.all,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return []
      await ensureDefaultCategories(user.id)
      return fetchCategories(user.id)
    },
  })
}
