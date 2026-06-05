import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden pt-[72px]">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden lg:flex-row">
        {/* Sidebar skeleton */}
        <div className="hidden w-72 shrink-0 border-r border-border lg:flex lg:flex-col xl:w-96">
          <div className="border-b border-border p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
          <div className="flex-1 p-3 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        </div>
        {/* Main content skeleton */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-border px-6 py-3">
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex-1 px-6 pt-6 pb-24 lg:px-10 xl:px-14 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-px w-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
