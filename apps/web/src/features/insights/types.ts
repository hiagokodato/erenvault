export type InsightTone = 'positive' | 'neutral' | 'warning'

export type FinancialInsight = {
  id: string
  title: string
  body: string
  tone: InsightTone
}

export type InsightContext = {
  monthLabel: string
  incomeCents: number
  expenseCents: number
  balanceCents: number
  transactionCount: number
  previousExpenseCents: number
  previousIncomeCents: number
  topCategoryName: string | null
  topCategoryShare: number
  goalsTotal: number
  goalsCompleted: number
  goalsNearDeadline: number
  cardsHighUsage: number
  cardsOverLimit: number
  totalCardUsagePercent: number
}
