import type { Category } from '@/features/categories/api/categories'
import type { Transaction, TransactionType } from '@erenvault/types'

export type CategorySpendRow = {
  categoryId: string | null
  name: string
  color: string | null
  amountCents: number
  share: number
}

function resolveCategoryName(
  categoryId: string | null,
  categories: Category[],
  uncategorizedLabel: string,
): { name: string; color: string | null } {
  if (!categoryId) {
    return { name: uncategorizedLabel, color: '#94a3b8' }
  }
  const cat = categories.find((c) => c.id === categoryId)
  return { name: cat?.name ?? 'Outros', color: cat?.color ?? '#94a3b8' }
}

export function computeSpendingByCategory(
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType,
  uncategorizedLabel = 'Sem categoria',
): CategorySpendRow[] {
  const filtered = transactions.filter((t) => t.type === type)
  const total = filtered.reduce((sum, t) => sum + t.amountCents, 0)
  if (total === 0) return []

  const byCategory = new Map<string | null, number>()
  for (const t of filtered) {
    const key = t.categoryId
    byCategory.set(key, (byCategory.get(key) ?? 0) + t.amountCents)
  }

  const rows: CategorySpendRow[] = []
  for (const [categoryId, amountCents] of byCategory) {
    const { name, color } = resolveCategoryName(categoryId, categories, uncategorizedLabel)
    rows.push({
      categoryId,
      name,
      color,
      amountCents,
      share: amountCents / total,
    })
  }

  return rows.sort((a, b) => b.amountCents - a.amountCents)
}
