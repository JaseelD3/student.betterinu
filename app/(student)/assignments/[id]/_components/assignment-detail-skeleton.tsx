import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton that mirrors the assignment detail page layout */
export function AssignmentDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Back link */}
      <Skeleton className="h-4 w-24" />

      {/* Hero card */}
      <div className="bg-card ring-foreground/10 overflow-hidden rounded-md p-5 ring-1">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="mb-3 h-8 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Instructions card */}
      <div className="bg-card ring-foreground/10 rounded-md p-5 ring-1">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Submission panel */}
      <div className="bg-card ring-foreground/10 rounded-md p-5 ring-1">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="mb-4 h-32 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  )
}
