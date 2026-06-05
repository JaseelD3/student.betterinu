import { BookOpen, CalendarClock, Star, Globe } from "lucide-react"

import { Card } from "@/components/ui/card"
import { StatusBadge, type StatusKey } from "../../_components/status-badge"

type AssignmentHeroProps = {
  title: string
  scope: "course" | "common"
  courseTitle: string | null
  dueDate: string | null
  totalMarks: number | null
  submittedAt: string | null
  submissionStatus: StatusKey | null
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function AssignmentHero({
  title,
  scope,
  courseTitle,
  dueDate,
  totalMarks,
  submittedAt,
  submissionStatus,
}: AssignmentHeroProps) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="p-5 sm:p-6">
        {/* Badge row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {/* Scope badge */}
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide">
            {scope === "common" ? (
              <>
                <Globe className="size-3" aria-hidden />
                Common Task
              </>
            ) : (
              <>
                <BookOpen className="size-3" aria-hidden />
                {courseTitle}
              </>
            )}
          </span>

          {/* Status badge */}
          {submissionStatus && <StatusBadge status={submissionStatus} />}
        </div>

        {/* Title */}
        <h1 className="text-foreground font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {title}
        </h1>

        {/* Meta chips */}
        <div className="border-border mt-4 flex flex-wrap gap-3">
          {dueDate && (
            <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]">
              <CalendarClock className="size-3.5" aria-hidden />
              Due {fmtDate(dueDate)}
            </span>
          )}
          {totalMarks && (
            <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]">
              <Star className="size-3.5" aria-hidden />
              {totalMarks} marks
            </span>
          )}
          {submittedAt && (
            <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]">
              Submitted {fmtDate(submittedAt)}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
