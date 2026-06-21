import type { Category } from '@/features/categories/api/categories'
import type { Transaction } from '@erenvault/types'

export type CategoryBudgetStatus = {
  categoryId: string
  name: string
  color: string | null
  spentCents: number
  budgetCents: number
  percent: number
  level: 'ok' | 'warning' | 'over'
}

export function computeCategoryBudgetStatuses(
  transactions: Transaction[],
  categories: Category[],
): CategoryBudgetStatus[] {
  const spentByCategory = new Map<string, number>()

  for (const t of transactions) {
    if (t.type !== 'expense' || !t.categoryId) continue
    spentByCategory.set(t.categoryId, (spentByCategory.get(t.categoryId) ?? 0) + t.amountCents)
  }

  const rows: CategoryBudgetStatus[] = []

  for (const category of categories) {
    const budgetCents = category.monthlyBudgetCents
    if (budgetCents == null || budgetCents <= 0) continue

    const spentCents = spentByCategory.get(category.id) ?? 0
    const percent = Math.min(Math.round((spentCents / budgetCents) * 100), 999)
    const level: CategoryBudgetStatus['level'] =
      spentCents > budgetCents ? 'over' : percent >= 80 ? 'warning' : 'ok'

    rows.push({
      categoryId: category.id,
      name: category.name,
      color: category.color,
      spentCents,
      budgetCents,
      percent,
      level,
    })
  }

  return rows.sort((a, b) => b.percent - a.percent)
}

export function getBudgetAlerts(statuses: CategoryBudgetStatus[]): CategoryBudgetStatus[] {
  return statuses.filter((s) => s.level === 'warning' || s.level === 'over')
}
