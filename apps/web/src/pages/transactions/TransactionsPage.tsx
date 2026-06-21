import { Button } from '@erenvault/ui'
import { Tags } from 'lucide-react'
import { Link } from 'react-router-dom'

import { MonthPicker } from '@/components/filters/MonthPicker'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/skeleton/Skeleton'
import { CsvImportPanel } from '@/features/csv-import/components/CsvImportPanel'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { TransactionList } from '@/features/transactions/components/TransactionList'
import { useAuth } from '@/features/auth/context/useAuth'
import { useCategories } from '@/hooks/useCategories'
import { useSelectedMonth } from '@/hooks/useSelectedMonth'
import { useMonthNavTo } from '@/hooks/useMonthNavTo'
import {
  computeMonthlySummary,
  useMonthTransactions,
  useTransactionMutations,
} from '@/hooks/useTransactions'
import { formatCurrency } from '@/utils/money'

export function TransactionsPage() {
  const { user } = useAuth()
  const { yearMonth, monthLabel, options, setYearMonth } = useSelectedMonth()
  const { monthNavTo } = useMonthNavTo()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: transactions = [], isLoading } = useMonthTransactions(yearMonth)
  const { create, update, remove, importCsv } = useTransactionMutations(user?.id)

  const summary = computeMonthlySummary(transactions)

  return (
    <PageShell width="wide" className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-caps">Lançamentos</p>
          <h1 className="font-display text-3xl font-semibold text-fg">Transações</h1>
          <p className="mt-2 text-sm text-muted capitalize">
            Período: <span>{monthLabel}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <MonthPicker
            id="transactions-month"
            value={yearMonth}
            options={options}
            onChange={setYearMonth}
          />
          <Link to={monthNavTo('/categorias')}>
            <Button variant="ghost" size="sm" className="gap-2">
              <Tags className="size-4" aria-hidden />
              Categorias
            </Button>
          </Link>
        </div>
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
      ) : transactions.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted">Nenhum lançamento neste período.</p>
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          categories={categories}
          isDeletingId={remove.isPending ? (remove.variables ?? null) : null}
          isUpdatingId={update.isPending ? (update.variables?.id ?? null) : null}
          onDelete={(id) => remove.mutate(id)}
          onUpdate={(id, data, onDone) => update.mutate({ id, ...data }, { onSuccess: onDone })}
        />
      )}
    </PageShell>
  )
}
