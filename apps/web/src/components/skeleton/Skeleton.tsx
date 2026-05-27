export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-fg/10 ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  )
}

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-3 w-full ${className}`} />
}
