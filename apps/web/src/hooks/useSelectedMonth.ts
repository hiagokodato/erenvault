import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  buildMonthPickerOptions,
  getCurrentMonthRange,
  getMonthRangeForYearMonth,
} from '@/utils/money'
import { MONTH_QUERY_PARAM, parseYearMonthParam } from '@/utils/monthQuery'

export function useSelectedMonth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = getCurrentMonthRange()

  const raw = searchParams.get(MONTH_QUERY_PARAM)
  const yearMonth = parseYearMonthParam(raw) ?? current.yearMonth

  const range = useMemo(() => getMonthRangeForYearMonth(yearMonth), [yearMonth])
  const options = useMemo(() => buildMonthPickerOptions(24), [])

  function setYearMonth(value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === current.yearMonth) next.delete(MONTH_QUERY_PARAM)
        else next.set(MONTH_QUERY_PARAM, value)
        return next
      },
      { replace: true },
    )
  }

  return {
    yearMonth,
    from: range.from,
    to: range.to,
    monthLabel: range.label,
    options,
    setYearMonth,
    isCurrentMonth: yearMonth === current.yearMonth,
  }
}
