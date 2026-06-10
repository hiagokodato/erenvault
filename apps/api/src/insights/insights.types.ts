export type InsightContextPayload = {
  monthLabel: string
  incomeBrl: string
  expenseBrl: string
  balanceBrl: string
  transactionCount: number
  previousExpenseBrl: string
  topCategoryName: string | null
  topCategoryShare: number
  goalsTotal: number
  goalsCompleted: number
  goalsNearDeadline: number
  cardsHighUsage: number
  cardsOverLimit: number
  totalCardUsagePercent: number
}

export type EnhanceInsightsResponse = {
  source: 'openai' | 'unconfigured'
  insights: string[]
}
