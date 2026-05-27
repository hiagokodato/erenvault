import type { Category } from '@/features/categories/api/categories'
import {
  computeCardsSummary,
  getCardUsagePercent,
  isCardOverLimit,
} from '@/features/credit-cards/api/creditCards'
import { getGoalProgress, isGoalComplete } from '@/features/goals/api/goals'
import { computeMonthlySummary } from '@/features/transactions/api/transactions'
import type { CreditCard, Goal, Transaction } from '@erenvault/types'

import type { InsightContext } from './types'

function getTopExpenseCategory(
  transactions: Transaction[],
  categories: Category[],
): { name: string | null; share: number } {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const total = expenses.reduce((sum, t) => sum + t.amountCents, 0)
  if (total === 0) return { name: null, share: 0 }

  const byCategory = new Map<string, number>()
  for (const t of expenses) {
    const key = t.categoryId ?? '__none__'
    byCategory.set(key, (byCategory.get(key) ?? 0) + t.amountCents)
  }

  let topKey = ''
  let topAmount = 0
  for (const [key, amount] of byCategory) {
    if (amount > topAmount) {
      topKey = key
      topAmount = amount
    }
  }

  const name =
    topKey === '__none__'
      ? 'Sem categoria'
      : (categories.find((c) => c.id === topKey)?.name ?? 'Outros')

  return { name, share: Math.round((topAmount / total) * 100) }
}

function countGoalsNearDeadline(goals: Goal[]): number {
  const today = new Date()
  const in30Days = new Date(today)
  in30Days.setDate(in30Days.getDate() + 30)

  return goals.filter((goal) => {
    if (!goal.deadline || isGoalComplete(goal)) return false
    const deadline = new Date(goal.deadline + 'T12:00:00')
    if (deadline < today) return true
    return deadline <= in30Days && getGoalProgress(goal) < 50
  }).length
}

export function buildInsightContext(input: {
  monthLabel: string
  currentTransactions: Transaction[]
  previousTransactions: Transaction[]
  goals: Goal[]
  cards: CreditCard[]
  categories: Category[]
}): InsightContext {
  const current = computeMonthlySummary(input.currentTransactions)
  const previous = computeMonthlySummary(input.previousTransactions)
  const topCategory = getTopExpenseCategory(input.currentTransactions, input.categories)
  const cardsSummary = computeCardsSummary(input.cards)

  const cardsHighUsage = input.cards.filter((c) => getCardUsagePercent(c) >= 80).length
  const cardsOverLimit = input.cards.filter((c) => isCardOverLimit(c)).length
  const totalCardUsagePercent =
    cardsSummary.totalLimitCents > 0
      ? Math.round((cardsSummary.totalUsedCents / cardsSummary.totalLimitCents) * 100)
      : 0

  const goalsCompleted = input.goals.filter(isGoalComplete).length

  return {
    monthLabel: input.monthLabel,
    incomeCents: current.incomeCents,
    expenseCents: current.expenseCents,
    balanceCents: current.balanceCents,
    transactionCount: current.count,
    previousExpenseCents: previous.expenseCents,
    previousIncomeCents: previous.incomeCents,
    topCategoryName: topCategory.name,
    topCategoryShare: topCategory.share,
    goalsTotal: input.goals.length,
    goalsCompleted,
    goalsNearDeadline: countGoalsNearDeadline(input.goals),
    cardsHighUsage,
    cardsOverLimit,
    totalCardUsagePercent,
  }
}
