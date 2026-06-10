import { Button } from '@erenvault/ui'
import { Download } from 'lucide-react'
import { useMemo } from 'react'

import { MonthPicker } from '@/components/filters/MonthPicker'
import { LoadingPanel } from '@/components/skeleton/LoadingPanel'
import { PageShell } from '@/components/layout/PageShell'
import {
  buildMonthTransactionsCsv,
  downloadCsv,
} from '@/features/csv-export/exportMonthCsv'
import { CategorySpendList } from '@/features/reports/components/CategorySpendList'
import { MonthComparisonPanel } from '@/features/reports/components/MonthComparisonPanel'
import { computeMonthComparison } from '@/features/reports/computeMonthComparison'
import { computeSpendingByCategory } from '@/features/reports/computeSpendingByCategory'
import { computeMonthlySummary } from '@/features/transactions/api/transactions'
import { useCategories } from '@/hooks/useCategories'
import { useSelectedMonth } from '@/hooks/useSelectedMonth'
import {
  useMonthTransactions,
  usePreviousMonthTransactions,
} from '@/hooks/useTransactions'
import { formatCurrency } from '@/utils/money'

export function ReportsPage() {
  const { yearMonth, monthLabel, options, setYearMonth } = useSelectedMonth()
  const { data: transactions = [], isLoading: txLoading } = useMonthTransactions(yearMonth)
  const {
    data: previousTransactions = [],
    isLoading: prevLoading,
    monthLabel: previousMonthLabel,
  } = usePreviousMonthTransactions(yearMonth)
  const { data: categories = [], isLoading: catLoading } = useCategories()

  const summary = computeMonthlySummary(transactions)
  const expenseRows = useMemo(
    () => computeSpendingByCategory(transactions, categories, 'expense'),
    [transactions, categories],
  )
  const incomeRows = useMemo(
    () => computeSpendingByCategory(transactions, categories, 'income'),
    [transactions, categories],
  )
  const comparison = useMemo(
    () => computeMonthComparison(transactions, previousTransactions),
    [transactions, previousTransactions],
  )

  const isLoading = txLoading || prevLoading || catLoading

  function handleExport() {
    const csv = buildMonthTransactionsCsv(transactions, categories)
    const safeMonth = monthLabel.replace(/\s+/g, '-').toLowerCase()
    downloadCsv(`erenvault-${safeMonth}.csv`, csv)
  }

  return (
    <PageShell width="wide" className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-caps">Análise</p>
          <h1 className="font-display text-3xl font-semibold text-fg">Relatórios</h1>
          <p className="mt-2 text-sm text-muted capitalize">
            Período: <span>{monthLabel}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <MonthPicker
            id="reports-month"
            value={yearMonth}
            options={options}
            onChange={setYearMonth}
          />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={isLoading || transactions.length === 0}
          >
            <Download className="size-4" aria-hidden />
            Exportar CSV
          </Button>
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

      {isLoading ? (
        <LoadingPanel rows={3} label="Carregando relatórios" />
      ) : (
        <div className="space-y-6">
          <MonthComparisonPanel
            currentLabel={monthLabel}
            previousLabel={previousMonthLabel}
            metrics={comparison}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold text-fg">Gastos por categoria</h2>
              <p className="mt-1 text-sm text-muted">Onde o dinheiro saiu no período.</p>
              <div className="mt-6">
                <CategorySpendList
                  rows={expenseRows}
                  emptyMessage="Nenhuma saída registrada neste período."
                />
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="font-display text-lg font-semibold text-fg">Entradas por categoria</h2>
              <p className="mt-1 text-sm text-muted">Origem das receitas do período.</p>
              <div className="mt-6">
                <CategorySpendList
                  rows={incomeRows}
                  emptyMessage="Nenhuma entrada registrada neste período."
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </PageShell>
  )
}
