"use client"

import {
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useDashboardAssignments } from "@/lib/hooks/use-dashboard"
import type { DashboardAssignment } from "@/types/dashboard"
import type { SubmissionStatus } from "@/types/assignment"

const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    Icon: React.ElementType
    label: string
    textCls: string
    bgCls: string
  }
> = {
  todo: {
    Icon: AlertCircle,
    label: "To Do",
    textCls: "text-blue-600",
    bgCls: "bg-blue-100 border-blue-200",
  },
  pending: {
    Icon: Clock,
    label: "Under Review",
    textCls: "text-amber-600",
    bgCls: "bg-amber-100 border-amber-200",
  },
  approved: {
    Icon: CheckCircle2,
    label: "Approved",
    textCls: "text-green-600",
    bgCls: "bg-green-100 border-green-200",
  },
  rejected: {
    Icon: XCircle,
    label: "Revise",
    textCls: "text-red-600",
    bgCls: "bg-red-100 border-red-200",
  },
}

const SORT_ORDER: Record<SubmissionStatus, number> = {
  todo: 0,
  rejected: 1,
  pending: 2,
  approved: 3,
}

export function AssignmentsList() {
  const { data: assignments, isLoading } = useDashboardAssignments()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  const sorted = [...(assignments ?? [])].sort(
    (a, b) => SORT_ORDER[a.status] - SORT_ORDER[b.status]
  )

  if (sorted.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-muted-foreground flex flex-col items-center py-12 text-center">
          <ClipboardCheck className="mb-3 size-10" />
          <p>No assignments found in your courses.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="px-0 pt-0 pb-0">
        <div className="divide-border divide-y">
          {sorted.map((sub) => (
            <AssignmentRow key={sub.id} assignment={sub} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AssignmentRow({ assignment }: { assignment: DashboardAssignment }) {
  const status = STATUS_CONFIG[assignment.status]
  const linkHref = `/course/${assignment.courseId}/assignments/${assignment.id}`

  return (
    <Link
      href={linkHref}
      className="hover:bg-muted/50 focus-ring flex flex-col p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-semibold">
            {assignment.title}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
            {assignment.courseTitle}
          </p>
          {assignment.dueDate && (
            <p className="text-muted-foreground mt-1 text-[10px]">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${status.bgCls} ${status.textCls}`}
        >
          <status.Icon className="size-3" />
          {status.label}
        </span>
      </div>
      {assignment.feedback && (
        <div className="bg-surface border-border text-foreground mt-2 rounded border p-2 text-xs">
          <strong className="text-muted-foreground">Feedback:</strong>{" "}
          {assignment.feedback}
        </div>
      )}
    </Link>
  )
}
