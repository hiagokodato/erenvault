import { useQuery } from '@tanstack/react-query'

import { buildInsightContext } from '@/features/insights/buildContext'
import { generateInsights, sortInsightsByPriority } from '@/features/insights/generateInsights'
import { fetchTransactionsForMonth } from '@/features/transactions/api/transactions'
import { transactionKeys } from '@/features/transactions/queryKeys'
import { useAuth } from '@/features/auth/context/useAuth'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useGoals } from '@/hooks/useGoals'
import { useCategories } from '@/hooks/useCategories'
import { getCurrentMonthRange, getPreviousMonthRange } from '@/utils/money'

export function useFinancialInsights() {
  const { user } = useAuth()
  const { from, to, label: monthLabel } = getCurrentMonthRange()
  const { from: prevFrom, to: prevTo, label: previousMonthLabel } = getPreviousMonthRange()

  const currentQuery = useQuery({
    queryKey: transactionKeys.month(from, to),
    enabled: Boolean(user?.id),
    queryFn: () => fetchTransactionsForMonth(user!.id, from, to),
  })

  const previousQuery = useQuery({
    queryKey: transactionKeys.month(prevFrom, prevTo),
    enabled: Boolean(user?.id),
    queryFn: () => fetchTransactionsForMonth(user!.id, prevFrom, prevTo),
  })

  const { data: goals = [], isLoading: goalsLoading } = useGoals()
  const { data: cards = [], isLoading: cardsLoading } = useCreditCards()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  const isLoading =
    currentQuery.isLoading ||
    previousQuery.isLoading ||
    goalsLoading ||
    cardsLoading ||
    categoriesLoading

  const context = buildInsightContext({
    monthLabel,
    currentTransactions: currentQuery.data ?? [],
    previousTransactions: previousQuery.data ?? [],
    goals,
    cards,
    categories: categories,
  })

  const insights = sortInsightsByPriority(generateInsights(context))

  return {
    insights,
    context,
    monthLabel,
    previousMonthLabel,
    isLoading,
  }
}
