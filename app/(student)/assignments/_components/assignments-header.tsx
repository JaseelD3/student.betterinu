import { ClipboardList } from "lucide-react"

type AssignmentsHeaderProps = {
  totalCourse: number
  totalOther: number
  newOtherCount: number
}

export function AssignmentsHeader({
  totalCourse,
  totalOther,
  newOtherCount,
}: AssignmentsHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <span className="bg-primary/10 flex size-9 items-center justify-center rounded-md">
          <ClipboardList className="text-primary size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-foreground font-display text-xl font-bold tracking-tight">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-xs">
            {totalCourse + totalOther} assignments
            {newOtherCount > 0 && (
              <span className="bg-primary ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white">
                {newOtherCount} new
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
