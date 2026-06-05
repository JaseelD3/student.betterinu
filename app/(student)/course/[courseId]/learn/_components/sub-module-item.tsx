"use client"

import Link from "next/link"
import {
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  PlayCircle,
  Wrench,
  HelpCircle,
} from "lucide-react"
import type { CourseId, SubModule } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const typeIcons: Record<string, any> = {
  doc: FileText,
  video: PlayCircle,
  exercise: Wrench,
  resource: ExternalLink,
  quiz: HelpCircle,
  assignment: ClipboardCheck,
}

export function SubModuleItem({
  courseId,
  weekId,
  module,
  dayId,
  daySubModulesIds,
}: {
  courseId: CourseId
  weekId: string
  module: SubModule
  dayId?: string
  daySubModulesIds?: string[]
}) {
  const { isSubModuleComplete, markSubModuleComplete } = useProgress()
  const complete = isSubModuleComplete(module.id)
  const Icon = typeIcons[module.type] || HelpCircle
  const isAutoAssessed =
    module.type === "quiz" || module.type === "assignment"

  const [assignmentStatus, setAssignmentStatus] = useState<string | null>(null)

  useEffect(() => {
    if (module.type === "assignment") {
      fetch(`/api/student/assignments?assignmentId=${module.id}&courseId=${courseId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.submission) {
            setAssignmentStatus(data.submission.status)
            if (data.submission.status === "approved" && !complete) {
              markSubModuleComplete(module.id, dayId, daySubModulesIds)
            }
          }
        })
        .catch(() => { })
    }
  }, [module.type, module.id, courseId, complete, markSubModuleComplete, dayId, daySubModulesIds])

  return (
    <div
      className={cn(
        "border-border group flex items-center gap-3 rounded-md border bg-card px-3 py-2 transition-all hover:shadow-sm",
        complete && "border-primary/20 bg-primary/5"
      )}
    >
      {/* Icon + Link */}
      <Link
        className="flex min-w-0 flex-1 items-center gap-3 no-underline focus-visible:outline-none"
        href={`/course/${courseId}/learn/${weekId}/${module.id}`}
      >
        {/* Icon wrapper */}
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md transition-colors",
            complete
              ? "bg-accent/15 text-accent"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          {complete ? (
            <CheckCircle2 className="size-4" aria-hidden />
          ) : (
            <Icon className="size-4" aria-hidden />
          )}
        </span>

        {/* Title */}
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate text-xs font-semibold transition-colors text-foreground/90",
              !complete && "group-hover:text-primary"
            )}
          >
            {module.title}
          </span>
          <span className="text-muted-foreground block text-[10px] capitalize">
            {module.type}
          </span>
        </span>
      </Link>

      {/* Right-side status / action */}
      {isAutoAssessed ? (
        <div className="shrink-0">
          {module.type === "assignment" ? (
            assignmentStatus === "approved" || complete ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                <CheckCircle2 className="size-3" />
                Approved
              </span>
            ) : assignmentStatus === "pending" ? (
              <span className="border-border inline-flex items-center gap-1 rounded-full border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                <ClipboardCheck className="size-3" />
                Pending
              </span>
            ) : assignmentStatus === "rejected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                Needs Revision
              </span>
            ) : (
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                Assignment
              </span>
            )
          ) : complete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              <CheckCircle2 className="size-3" />
              Done
            </span>
          ) : (
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              Quiz
            </span>
          )}
        </div>
      ) : (
        <Button
          onClick={() => markSubModuleComplete(module.id, dayId, daySubModulesIds)}
          size="xs"
          type="button"
          variant={complete ? "default" : "outline"}
          className={cn(
            "shrink-0 gap-1 transition-all duration-200",
            complete
              ? "bg-accent/80 text-accent-foreground hover:bg-primary/90"
              : "hover:bg-accent hover:text-accent-foreground hover:border-accent"
          )}
        >
          {complete && <CheckCircle2 className="size-3" aria-hidden />}
          {complete ? "Done" : "Mark Done"}
        </Button>
      )}
    </div>
  )
}
