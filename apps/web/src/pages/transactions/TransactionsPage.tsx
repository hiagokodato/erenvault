import { PageShell } from '@/components/layout/PageShell'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { TransactionList } from '@/features/transactions/components/TransactionList'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useCategories } from '@/hooks/useCategories'
import {
  computeMonthlySummary,
  useMonthTransactions,
  useTransactionMutations,
} from '@/hooks/useTransactions'
import { formatCurrency } from '@/utils/money'

export function TransactionsPage() {
  const { user } = useAuth()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: transactions = [], isLoading, monthLabel } = useMonthTransactions()
  const { create, remove } = useTransactionMutations(user?.id)

  const summary = computeMonthlySummary(transactions)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Lançamentos</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Transações</h1>
        <p className="mt-2 text-sm capitalize text-muted">{monthLabel}</p>
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

      {isLoading ? (
        <p className="text-center text-sm text-muted">Carregando lançamentos…</p>
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
