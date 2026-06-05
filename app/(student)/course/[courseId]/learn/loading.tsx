import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-0 w-full">
      {/* Sidebar skeleton */}
      <div className="hidden w-[360px] shrink-0 border-r border-border lg:block">
        <div className="p-5 space-y-4">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="min-w-0 flex-1 space-y-5 p-4 sm:p-6">
        <Skeleton className="h-28 w-full rounded-md" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
