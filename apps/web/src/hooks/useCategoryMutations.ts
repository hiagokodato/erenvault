import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '@/features/categories/api/categories'
import { categoryKeys } from '@/features/transactions/queryKeys'
import { useAuth } from '@/features/auth/context/useAuth'

export function useCategoryMutations() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: categoryKeys.all })

  const create = useMutation({
    mutationFn: (input: Omit<CreateCategoryInput, 'userId'>) => {
      if (!user) throw new Error('Usuário não autenticado')
      return createCategory({ ...input, userId: user.id })
    },
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: (input: UpdateCategoryInput) => updateCategory(input),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
