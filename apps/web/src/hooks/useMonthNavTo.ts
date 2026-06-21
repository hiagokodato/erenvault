import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getYearMonthFromSearch, withMonthQuery } from '@/utils/monthQuery'
import { getCurrentMonthRange } from '@/utils/money'

/** Preserva `?mes=` da URL atual ao montar links internos. */
export function useMonthNavTo() {
  const [searchParams] = useSearchParams()
  const current = getCurrentMonthRange()

  const fromUrl = getYearMonthFromSearch(`?${searchParams.toString()}`)
  const yearMonth =
    fromUrl && fromUrl !== current.yearMonth ? fromUrl : null

  const monthNavTo = useCallback((path: string) => withMonthQuery(path, yearMonth), [yearMonth])

  return { monthNavTo, yearMonth: fromUrl ?? current.yearMonth }
}
