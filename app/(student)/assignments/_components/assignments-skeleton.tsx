import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton that mirrors the tab bar + card list layout of AssignmentsClient */
export function AssignmentsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Tab bar skeleton with background container */}
      <div className="flex">
        <div className="inline-flex h-11 items-center justify-center rounded-lg bg-card p-1 border border-border/60 gap-1">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Shared Outer Container skeleton */}
      <div className="relative border border-dashed border-border bg-card rounded-md p-5 flex-1 flex flex-col gap-4 min-h-[350px]">
        {/* Filter pills skeleton */}
        <div className="flex flex-wrap gap-2 pr-10">
          {[80, 100, 90, 110].map((w, i) => (
            <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-border bg-card flex flex-col justify-between gap-4 rounded-md p-4 min-h-[120px]"
            >
              <div className="space-y-2 w-full">
                {/* Title */}
                <Skeleton className="h-5 w-3/4 rounded" />
                {/* Badge */}
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="w-full">
                {/* Due date */}
                <Skeleton className="h-3.5 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
