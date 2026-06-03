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
import { useEffect, useState } from "react"
import { studentApi } from "@/lib/api-client"

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
}: {
  courseId: CourseId
  weekId: string
  module: SubModule
}) {
  const { isSubModuleComplete, markSubModuleComplete } = useProgress()
  const complete = isSubModuleComplete(module.id)
  const Icon = typeIcons[module.type] || HelpCircle
  const isAutoAssessed = module.type === "quiz" || module.type === "assignment"

  const [assignmentStatus, setAssignmentStatus] = useState<string | null>(null)

  useEffect(() => {
    if (module.type === "assignment") {
      studentApi
        .listAssignments({ assignmentId: module.id, courseId })
        .then((data) => {
          if (data.submission) {
            setAssignmentStatus(data.submission.status)
            if (data.submission.status === "approved" && !complete) {
              markSubModuleComplete(module.id)
            }
          }
        })
        .catch(() => {})
    }
  }, [module.type, module.id, courseId, complete, markSubModuleComplete])

  return (
    <div className="group border-default bg-surface/50 flex flex-col gap-3 rounded-md border p-3 transition-all hover:bg-white hover:shadow-sm sm:flex-row sm:items-center">
      <Link
        className="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-md no-underline"
        href={`/course/${courseId}/learn/${weekId}/${module.id}`}
      >
        <span className="text-primary grid size-10 shrink-0 place-items-center rounded-md bg-green-50 transition-colors group-hover:bg-green-100">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="text-foreground group-hover:text-primary block truncate font-semibold no-underline transition-colors group-hover:no-underline hover:no-underline">
            {module.title}
          </span>
          {/* <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
            {module.duration}
          </span> */}
        </span>
      </Link>
      {isAutoAssessed ? (
        <div className="flex shrink-0 items-center pr-2">
          {module.type === "assignment" ? (
            assignmentStatus === "approved" ? (
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                <CheckCircle2 className="size-3.5" /> Approved
              </span>
            ) : assignmentStatus === "pending" ? (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm">
                <ClipboardCheck className="size-3.5" /> Pending Approval
              </span>
            ) : assignmentStatus === "rejected" ? (
              <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                Needs Revision
              </span>
            ) : complete ? (
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                <CheckCircle2 className="size-3.5" /> Approved
              </span>
            ) : (
              <span className="text-muted px-2 text-[10px] font-bold tracking-widest uppercase">
                Assignment
              </span>
            )
          ) : complete ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
              <CheckCircle2 className="size-3.5" /> Done
            </span>
          ) : (
            <span className="text-muted px-2 text-[10px] font-bold tracking-widest uppercase">
              Quiz
            </span>
          )}
        </div>
      ) : (
        <Button
          onClick={() => markSubModuleComplete(module.id)}
          size="sm"
          type="button"
          variant="secondary"
          className={`shrink-0 ${complete ? "bg-primary hover:bg-primary/90 text-white hover:text-white" : ""}`}
        >
          <span className="flex items-center gap-2">
            {complete && <CheckCircle2 className="size-4" aria-hidden />}
            {complete ? "Done" : "Mark Complete"}
          </span>
        </Button>
      )}
    </div>
  )
}
