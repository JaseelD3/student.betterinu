"use client"

import {
  BookOpen,
  ClipboardList,
  Star,
  CalendarClock,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardAssignment } from "@/types/dashboard"
import type { DashboardCourse } from "@/types/dashboard"

type DashboardStatsProps = {
  courses: DashboardCourse[] | undefined
  assignments: DashboardAssignment[] | undefined
  isLoadingCourses: boolean
  isLoadingAssignments: boolean
}

export function DashboardStats({
  courses,
  assignments,
  isLoadingCourses,
  isLoadingAssignments,
}: DashboardStatsProps) {
  const enrolledCount = courses?.length ?? 0
  const pendingCount =
    assignments?.filter((a) => a.status === "todo" || a.status === "pending")
      .length ?? 0
  const overdueCount =
    assignments?.filter((a) => a.isOverdue && a.status === "todo").length ?? 0
  const upcomingCount =
    assignments?.filter(
      (a) => a.dueDate && !a.isOverdue && a.status === "todo"
    ).length ?? 0

  const avgProgress =
    courses && courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + c.progressPercentage, 0) /
            courses.length
        )
      : 0

  const stats = [
    {
      id: "enrolled",
      label: "Enrolled Courses",
      value: isLoadingCourses ? null : enrolledCount,
      Icon: BookOpen,
    },
    {
      id: "pending",
      label: "Pending Assignments",
      value: isLoadingAssignments ? null : pendingCount,
      Icon: ClipboardList,
    },
    {
      id: "progress",
      label: "Avg. Completion",
      value: isLoadingCourses ? null : `${avgProgress}%`,
      Icon: Star,
    },
    {
      id: "deadlines",
      label: "Upcoming Deadlines",
      value: isLoadingAssignments ? null : upcomingCount + overdueCount,
      Icon: CalendarClock,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ id, label, value, Icon }) => (
        <Card key={id} size="sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-medium">
                {label}
              </CardTitle>
              <Icon className="text-muted-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {value === null ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="font-display text-foreground text-3xl font-semibold leading-none tracking-tight">
                {value}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
