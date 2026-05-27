/** Perfil do usuário (espelha `public.profiles` no Supabase). */
export type UserProfile = {
  id: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'income' | 'expense'

/** Transação financeira (espelha `public.transactions`). */
export type Transaction = {
  id: string
  userId: string
  type: TransactionType
  amountCents: number
  description: string
  categoryId: string | null
  occurredOn: string
  createdAt: string
}

/** Meta de economia (espelha `public.goals`). */
export type Goal = {
  id: string
  userId: string
  title: string
  targetAmountCents: number
  savedAmountCents: number
  deadline: string | null
  createdAt: string
}
