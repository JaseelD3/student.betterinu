import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="space-y-5">
        {/* Header Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-1 h-3 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-44 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Calendar + Legend */}
          <div className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-2">
            {/* Legend Skeleton */}
            <Card className="py-0 bg-card">
              <CardContent className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Skeleton className="size-3 rounded" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
                <div className="mx-1 h-3.5 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-3 rounded" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>

            {/* Calendar Skeleton */}
            <Card className="py-0 bg-card overflow-hidden flex-1">
              <CardContent className="p-4">
                {/* Weekdays */}
                <div className="mb-3 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-center py-1.5">
                      <Skeleton className="h-3.5 w-8" />
                    </div>
                  ))}
                </div>
                {/* Grid cells */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-1">
            {/* Day Detail Skeleton */}
            <Card className="py-0 bg-card gap-0">
              <CardHeader className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4 px-4 pt-3 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
                <Skeleton className="h-20 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Monthly Stats Skeleton */}
            <Card className="py-0 bg-card gap-0 flex-1">
              <CardHeader className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4 px-4 pt-3 pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
