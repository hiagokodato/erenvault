import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

import type { FinancialInsight, InsightTone } from '@/features/insights/types'

const toneStyles: Record<InsightTone, { border: string; icon: string; Icon: typeof Info }> = {
  positive: {
    border: 'border-emerald-500/30 bg-emerald-500/5',
    icon: 'text-emerald-400',
    Icon: CheckCircle2,
  },
  neutral: {
    border: 'border-border/60 bg-fg/[0.02]',
    icon: 'text-primary',
    Icon: Info,
  },
  warning: {
    border: 'border-amber-500/30 bg-amber-500/5',
    icon: 'text-amber-300',
    Icon: AlertTriangle,
  },
}

type InsightCardProps = {
  insight: FinancialInsight
}

export function InsightCard({ insight }: InsightCardProps) {
  const style = toneStyles[insight.tone]
  const Icon = style.Icon

  return (
    <li className={`panel border p-5 ${style.border}`}>
      <div className="flex gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-fg/5 ${style.icon}`}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-fg">{insight.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{insight.body}</p>
        </div>
      </div>
    </li>
  )
}
