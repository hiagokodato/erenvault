import { PageShell } from '@/components/layout/PageShell'
import { CsvImportPanel } from '@/features/csv-import/components/CsvImportPanel'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { TransactionList } from '@/features/transactions/components/TransactionList'
import { Skeleton } from '@/components/skeleton/Skeleton'
import { useAuth } from '@/features/auth/context/useAuth'
import { useCategories } from '@/hooks/useCategories'
import {
  computeMonthlySummary,
  useRecentTransactions,
  useTransactionMutations,
} from '@/hooks/useTransactions'
import { formatCurrency, getCurrentMonthRange } from '@/utils/money'

export function TransactionsPage() {
  const { user } = useAuth()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: transactions = [], isLoading, monthLabel } = useRecentTransactions()
  const { create, remove, importCsv } = useTransactionMutations(user?.id)

  const { from, to } = getCurrentMonthRange()
  const monthTransactions = transactions.filter((t) => t.occurredOn >= from && t.occurredOn <= to)
  const summary = computeMonthlySummary(monthTransactions)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Lançamentos</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Transações</h1>
        <p className="mt-2 text-sm text-muted">
          Resumo de <span className="capitalize">{monthLabel}</span> · lista com lançamentos
          recentes
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel-inset p-4 text-center">
          <p className="label-caps">Entradas</p>
          <p className="mt-1 font-display text-xl font-semibold text-emerald-400">
            {formatCurrency(summary.incomeCents)}
          </p>
        </div>
        <div className="panel-inset p-4 text-center">
          <p className="label-caps">Saídas</p>
          <p className="mt-1 font-display text-xl font-semibold text-fg">
            {formatCurrency(summary.expenseCents)}
          </p>
        </div>
        <div className="panel-inset p-4 text-center">
          <p className="label-caps">Saldo</p>
          <p className="mt-1 font-display text-xl font-semibold text-primary">
            {formatCurrency(summary.balanceCents)}
          </p>
        </div>
      </div>

      <TransactionForm
        categories={categories}
        isSubmitting={create.isPending || categoriesLoading}
        onSubmit={(data) => create.mutate(data)}
      />

      <CsvImportPanel
        isImporting={importCsv.isPending}
        onImport={(rows) => importCsv.mutate(rows)}
      />

      {isLoading ? (
        <ul className="space-y-3" aria-label="Carregando lançamentos">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="panel p-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/12" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <TransactionList
          transactions={transactions}
          categories={categories}
          isDeletingId={remove.isPending ? (remove.variables ?? null) : null}
          onDelete={(id) => remove.mutate(id)}
        />
      )}
    </PageShell>
  )
}
