import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  buildMonthPickerOptions,
  getCurrentMonthRange,
  getMonthRangeForYearMonth,
} from '@/utils/money'

const PARAM = 'mes'

export function useSelectedMonth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = getCurrentMonthRange()

  const raw = searchParams.get(PARAM)
  const yearMonth = raw && /^\d{4}-\d{2}$/.test(raw) ? raw : current.yearMonth

  const range = useMemo(() => getMonthRangeForYearMonth(yearMonth), [yearMonth])
  const options = useMemo(() => buildMonthPickerOptions(24), [])

  function setYearMonth(value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === current.yearMonth) next.delete(PARAM)
        else next.set(PARAM, value)
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
