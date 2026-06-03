"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { Course } from "@/types"
import { studentApi } from "@/lib/api-client"

interface Submission {
  id: string
  assignment_id: string
  course_id: string
  week_id: string
  day_id: string
  course_title: string
  submitted_text: string
  submitted_at: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
}

const STATUS_CONFIG = {
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

export function AssignmentsList({
  enrolledCourses,
}: {
  enrolledCourses: Course[] | null
}) {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)

  useEffect(() => {
    studentApi
      .listAssignments()
      .then((data) => setSubmissions(data.submissions ?? []))
      .catch(() => setSubmissions([]))
  }, [])

  if (submissions === null || enrolledCourses === null) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Find all assignments from enrolled courses
  const allAssignments: any[] = []
  enrolledCourses.forEach((course) => {
    course.weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.subModules.forEach((mod) => {
          if (mod.type === "assignment") {
            // Find if there's a submission for this
            const submission = submissions.find(
              (s) => s.assignment_id === mod.id
            )
            allAssignments.push({
              id: submission?.id || `unsub-${mod.id}`,
              assignment_id: mod.id,
              course_id: course.id,
              week_id: week.id,
              day_id: day.id,
              course_title: course.title,
              assignment_title: mod.title || "Assignment",
              submitted_at: submission?.submitted_at,
              status: submission ? submission.status : "todo",
              feedback: submission?.feedback,
            })
          }
        })
      })
    })
  })

  // Sort: To Do first, then Revise (rejected), then Pending, then Approved
  const sortOrder = { todo: 0, rejected: 1, pending: 2, approved: 3 }
  allAssignments.sort(
    (a, b) =>
      sortOrder[a.status as keyof typeof sortOrder] -
      sortOrder[b.status as keyof typeof sortOrder]
  )

  if (allAssignments.length === 0) {
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
          {allAssignments.map((sub) => {
            const status =
              STATUS_CONFIG[sub.status as keyof typeof STATUS_CONFIG] ||
              STATUS_CONFIG.todo
            const linkHref = `/course/${sub.course_id}/learn/${sub.week_id}/${sub.assignment_id}`

            return (
              <Link
                key={sub.id}
                href={linkHref}
                className="hover:bg-muted/50 focus-ring flex flex-col p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {sub.assignment_title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
                      {sub.course_title}
                    </p>
                    {sub.submitted_at && (
                      <p className="text-muted-foreground mt-1 text-[10px]">
                        Submitted:{" "}
                        {new Date(sub.submitted_at).toLocaleDateString()}
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
                {sub.feedback && (
                  <div className="bg-surface border-border text-foreground mt-2 rounded border p-2 text-xs">
                    <strong className="text-muted-foreground">Feedback:</strong>{" "}
                    {sub.feedback}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
