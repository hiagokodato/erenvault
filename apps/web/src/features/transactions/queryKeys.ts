export const transactionKeys = {
  all: ['transactions'] as const,
  month: (from: string, to: string) => [...transactionKeys.all, 'month', from, to] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
}
