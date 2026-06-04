import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function CourseDetailSkeleton() {
  return (
    <div className="flex min-h-0 w-full flex-col gap-6 p-4 sm:p-6">
      {/* Hero */}
      <div className="bg-card ring-foreground/10 flex flex-col gap-6 overflow-hidden rounded-md p-6 ring-1 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="mt-2 h-10 w-36" />
        </div>
        <Skeleton className="hidden h-48 w-80 rounded-md lg:block" />
      </div>

      {/* Two-column body */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Left — Syllabus */}
        <div className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-md p-5 ring-1">
          <Skeleton className="h-5 w-40" />
          <Separator />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2 py-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>

        {/* Right — Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-card ring-foreground/10 rounded-md p-5 ring-1">
            <Skeleton className="mb-3 h-5 w-28" />
            <div className="grid gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="bg-card ring-foreground/10 rounded-md p-5 ring-1">
            <Skeleton className="mb-3 h-5 w-32" />
            <div className="grid gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
