import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      {/* Welcome header skeleton */}
      <div className="bg-card ring-foreground/10 overflow-hidden rounded-md ring-1">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
        <div className="border-border/50 border-t px-5 py-2.5">
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card ring-foreground/10 flex flex-col gap-2 rounded-md p-4 ring-1"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
          {[200, 180, 160].map((h, i) => (
            <Skeleton
              key={i}
              className={`h-${Math.floor(h / 4)} w-full rounded-md`}
              style={{ height: h }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Skeleton className="w-full rounded-md" style={{ height: 260 }} />
          <Skeleton className="w-full rounded-md" style={{ height: 200 }} />
        </div>
      </div>
    </div>
  )
}
