"use client"

import { Award, BarChart3, BookOpen, Clock, GraduationCap } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Course } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CourseStatsCardProps = {
  course: Course
}

type StatRowProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  tooltip?: string
}

function StatRow({ icon, label, value, tooltip }: StatRowProps) {
  return (
    <div className="bg-muted/40 ring-border/40 flex items-center justify-between gap-3 rounded-md px-3 py-2.5 ring-1">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
        {icon}
        {label}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "shrink-0 text-xs font-semibold",
                tooltip && "cursor-help"
              )}
            >
              {value}
            </div>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function CourseStatsCard({ course }: CourseStatsCardProps) {
  const { progress } = useProgress()
  const enrolled = progress.enrolledCourses.includes(course.id)

  const allSubModules = course.weeks.flatMap((w) =>
    w.days.flatMap((d) => d.subModules)
  )
  const totalSubModules = allSubModules.length
  const completedCount = enrolled
    ? allSubModules.filter((sm) => progress.completedSubModules.includes(sm.id))
        .length
    : 0
  const completionPct =
    totalSubModules > 0
      ? Math.round((completedCount / totalSubModules) * 100)
      : 0

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-foreground text-sm font-bold">
          Course Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 pt-4">
        <StatRow
          icon={<Clock className="size-3.5" aria-hidden />}
          label="Duration"
          value={<span className="text-foreground">{course.duration}</span>}
        />
        <StatRow
          icon={<BookOpen className="size-3.5" aria-hidden />}
          label="Modules"
          value={<span className="text-foreground">{course.totalModules}</span>}
        />
        <StatRow
          icon={<GraduationCap className="size-3.5" aria-hidden />}
          label="Level"
          value={
            <Badge variant="outline" className="text-[10px]">
              {course.level}
            </Badge>
          }
        />
        <StatRow
          icon={<Award className="size-3.5" aria-hidden />}
          label="Certificate"
          value={
            <Badge variant="secondary" className="text-[10px]">
              Included
            </Badge>
          }
          tooltip="A certificate of completion is awarded upon finishing all modules."
        />
        <StatRow
          icon={<BarChart3 className="size-3.5" aria-hidden />}
          label="Weeks"
          value={<span className="text-foreground">{course.weeks.length}</span>}
        />

        {enrolled && (
          <>
            <Separator />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  Your progress
                </span>
                <span className="text-foreground text-xs font-bold">
                  {completionPct}%
                </span>
              </div>
              <Progress value={completionPct} className="h-1.5" />
              <p className="text-muted-foreground text-[10px]">
                {completedCount} / {totalSubModules} sub-modules completed
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
