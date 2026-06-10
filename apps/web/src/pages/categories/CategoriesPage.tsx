import { useState } from 'react'

import { LoadingPanel } from '@/components/skeleton/LoadingPanel'
import { PageShell } from '@/components/layout/PageShell'
import { mapCategoryError } from '@/features/categories/api/categories'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import { CategoryForm } from '@/features/categories/components/CategoryForm'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryMutations } from '@/hooks/useCategoryMutations'

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const { create, update, remove } = useCategoryMutations()
  const [createError, setCreateError] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  const editingId = update.isPending ? update.variables?.id : null

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Organização</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Categorias</h1>
        <p className="mt-2 text-sm text-muted">
          Crie, edite ou remova categorias usadas nos lançamentos e relatórios.
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
    </PageShell>
  )
}
