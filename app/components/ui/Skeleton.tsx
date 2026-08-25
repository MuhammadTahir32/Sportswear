import { cn } from '@/lib/cn'

type SkeletonProps = {
  className?: string
  width?: string
  height?: string
}

export function Skeleton({ className, width, height }: SkeletonProps): React.JSX.Element {
  return <div className={cn('skeleton rounded-md', className)} style={{ width, height }} />
}

export function ProductCardSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-[10px]" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-20 mt-1" />
        <Skeleton className="h-4 w-16 mt-0.5" />
        <div className="flex gap-1.5 mt-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-5 h-5 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton(): React.JSX.Element {
  return (
    <div className="w-full h-[600px] rounded-none">
      <Skeleton className="w-full h-full" />
    </div>
  )
}
