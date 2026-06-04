import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-44" />
      </div>

      <Separator />

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-md p-4 ring-1"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-8 w-14" />
          </div>
        ))}
      </div>

      {/* Two-column section skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left — continue learning */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-36" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-md p-4 ring-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Right — upcoming deadlines */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5 last:border-b-0"
              >
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Recent activity skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-border/50 px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2.5 w-52" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
