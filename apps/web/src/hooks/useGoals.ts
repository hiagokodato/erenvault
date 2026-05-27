import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addToGoalSaved,
  createGoal,
  deleteGoal,
  fetchGoals,
  type CreateGoalInput,
} from '@/features/goals/api/goals'
import { goalKeys } from '@/features/goals/queryKeys'
import { useAuth } from '@/features/auth/context/AuthProvider'

export function useGoals() {
  const { user } = useAuth()

  return useQuery({
    queryKey: goalKeys.all,
    enabled: Boolean(user?.id),
    queryFn: () => fetchGoals(user!.id),
  })
}

export function useGoalMutations(userId: string | undefined) {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: goalKeys.all })

  const create = useMutation({
    mutationFn: (input: Omit<CreateGoalInput, 'userId'>) => {
      if (!userId) throw new Error('Usuário não autenticado')
      return createGoal({ ...input, userId })
    },
    onSuccess: invalidate,
  })

  const addSaved = useMutation({
    mutationFn: ({ id, addCents }: { id: string; addCents: number }) => addToGoalSaved(id, addCents),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteGoal,
    onSuccess: invalidate,
  })

  return { create, addSaved, remove }
}
