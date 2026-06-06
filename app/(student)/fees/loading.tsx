import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Fee Overview Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-7 w-24" />
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Strip */}
        <Skeleton className="h-16 w-full rounded-md" />

        {/* Enrollment Card */}
        <Card>
          <CardHeader className="border-b pb-3">
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>

        {/* Installment Timeline skeleton */}
        <Card>
          <CardHeader className="border-b pb-3">
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <Skeleton className="h-28 flex-1 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
