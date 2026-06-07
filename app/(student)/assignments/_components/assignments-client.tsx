"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { useCourseAssignments, useStandaloneAssignments } from "@/lib/hooks/use-assignments"
import { Button } from "@/components/ui/button"

import { AssignmentsTabs } from "./assignments-tabs"
import { AssignmentsSkeleton } from "./assignments-skeleton"
import { TaskDetailModal } from "./task-detail-modal"
import type { CourseAssignmentRow } from "./course-assignment-card"
import type { StandaloneAssignmentRow } from "./standalone-assignment-card"

type CourseFilter = "all" | "pending" | "approved" | "rejected"
type OtherFilter = "all" | "todo" | "pending" | "approved" | "rejected"

export function AssignmentsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const initialTab = searchParams.get("tab") === "other" ? "other" : "course"
  const [activeTab, setActiveTab] = useState<"course" | "other">(initialTab)

  // Sync state if URL changes externally
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "other" || tab === "course") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = useCallback((tab: "course" | "other") => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all")
  const [otherFilter, setOtherFilter] = useState<OtherFilter>("all")

  // Modal state — null = closed, string = assignmentId to show
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const openTask = useCallback((id: string) => setOpenTaskId(id), [])
  const closeTask = useCallback(() => setOpenTaskId(null), [])

  const {
    data: courseAssignments = [],
    isLoading: loadingCourse,
    isError: errorCourse,
    error: errorCourseMsg,
    refetch: refetchCourse,
  } = useCourseAssignments()

  const {
    data: standaloneAssignments = [],
    isLoading: loadingOther,
    isError: errorOther,
    error: errorOtherMsg,
    refetch: refetchOther,
  } = useStandaloneAssignments()

  const isLoading = loadingCourse || loadingOther

  if (isLoading) {
    return <AssignmentsSkeleton />
  }

  if (errorCourse || errorOther) {
    const msg =
      (errorCourseMsg instanceof Error ? errorCourseMsg.message : null) ??
      (errorOtherMsg instanceof Error ? errorOtherMsg.message : null) ??
      "Failed to load assignments."
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" aria-hidden />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Could not load tasks
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{msg}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetchCourse()
            refetchOther()
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 w-full flex-col gap-6">
        <AssignmentsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          courseFilter={courseFilter}
          onCourseFilterChange={setCourseFilter}
          otherFilter={otherFilter}
          onOtherFilterChange={setOtherFilter}
          courseAssignments={courseAssignments as unknown as CourseAssignmentRow[]}
          otherAssignments={standaloneAssignments as unknown as StandaloneAssignmentRow[]}
          onOpenTask={openTask}
        />
      </div>

      {/* Task detail modal */}
      {openTaskId && (
        <TaskDetailModal
          assignmentId={openTaskId}
          onClose={closeTask}
        />
      )}
    </>
  )
}
