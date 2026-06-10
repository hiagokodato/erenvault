import { Skeleton, SkeletonLine } from '@/components/skeleton/Skeleton'

type LoadingPanelProps = {
  rows?: number
  label?: string
}

export function LoadingPanel({ rows = 3, label = 'Carregando' }: LoadingPanelProps) {
  return (
    <ul className="space-y-3" aria-label={label} aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="panel p-5">
          <div className="space-y-2">
            <SkeletonLine className="w-2/3" />
            <SkeletonLine className="w-full" />
            <Skeleton className="h-3 w-5/12" />
          </div>
        </li>
      ))}
    </ul>
  )
}
