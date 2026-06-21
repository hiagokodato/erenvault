import { useMemo, useState } from 'react'

import { LoadingPanel } from '@/components/skeleton/LoadingPanel'
import { PageShell } from '@/components/layout/PageShell'
import { mapCategoryError } from '@/features/categories/api/categories'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import { CategoryForm } from '@/features/categories/components/CategoryForm'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryMutations } from '@/hooks/useCategoryMutations'
import { useResolvedYearMonth } from '@/hooks/useMonthNavTo'
import { useMonthTransactions } from '@/hooks/useTransactions'

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const yearMonth = useResolvedYearMonth()
  const { data: transactions = [] } = useMonthTransactions(yearMonth)
  const { create, update, remove } = useCategoryMutations()
  const [createError, setCreateError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  const editingId = update.isPending ? update.variables?.id : null

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      if (t.type !== 'expense' || !t.categoryId) continue
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amountCents)
    }
    return map
  }, [transactions])

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Organização</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Categorias</h1>
        <p className="mt-2 text-sm text-muted">
          Crie categorias, defina orçamento mensal opcional e acompanhe os gastos.
        </p>
      </header>

      <CategoryForm
        isSubmitting={create.isPending}
        serverError={createError}
        onSubmit={(data) => {
          setCreateError(null)
          create.mutate(data, {
            onSuccess: () => setCreateError(null),
            onError: (err) => setCreateError(mapCategoryError(err)),
          })
        }}
      />

      {isLoading ? (
        <LoadingPanel rows={3} label="Carregando categorias" />
      ) : categories.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted">Nenhuma categoria ainda. Crie a primeira acima.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              spentCents={spentByCategory.get(category.id) ?? 0}
              isDeleting={remove.isPending && remove.variables === category.id}
              isSaving={update.isPending && editingId === category.id}
              saveError={editingId === category.id ? editError : null}
              onUpdate={(data) => {
                setEditError(null)
                update.mutate(data, {
                  onError: (err) => setEditError(mapCategoryError(err)),
                })
              }}
              onDelete={(id) => {
                if (!window.confirm('Excluir esta categoria? Lançamentos ficam sem categoria.')) {
                  return
                }
                remove.mutate(id)
              }}
            />
          ))}
        </ul>
      )}

      {categories.some((c) => c.monthlyBudgetCents != null && c.monthlyBudgetCents > 0) && (
        <p className="text-center text-xs text-muted">
          Orçamentos comparam saídas do mês atual com o limite definido em cada categoria.
        </p>
      )}
    </PageShell>
  )
}
