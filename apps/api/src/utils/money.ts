export function formatBrl(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function summarizeTransactions(rows: { type: string; amount_cents: number }[]) {
  let incomeCents = 0
  let expenseCents = 0

  for (const row of rows) {
    if (row.type === 'income') incomeCents += row.amount_cents
    else expenseCents += row.amount_cents
  }

  return {
    incomeCents,
    expenseCents,
    balanceCents: incomeCents - expenseCents,
    count: rows.length,
  }
}
