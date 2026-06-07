"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, CalendarDays, Layers } from "lucide-react"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

import { useWeekProgress } from "@/lib/hooks/use-dashboard-progress"
import { useCourses } from "@/lib/hooks/use-courses"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type ProgressChartProps = { pct: number }

function ProgressChart({ pct }: ProgressChartProps) {
  return (
    <ResponsiveContainer width={90} height={90}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
        data={[{ value: pct, fill: "var(--color-primary)" }]}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background={{ fill: "var(--color-muted)" }} dataKey="value" cornerRadius={8} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={16}
          fontWeight={700}
          fill="currentColor"
        >
          {pct}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

export function ContinueLearningCard() {
  const { data, isLoading, isError } = useWeekProgress()
  const { data: courses = [] } = useCourses()

  if (isLoading) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden py-0 bg-white dark:bg-card flex flex-col min-h-[380px]">
        <CardContent className="p-5 flex flex-col flex-1">
          {/* Header skeleton */}
          <div className="w-full flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          
          {/* Title skeleton */}
          <Skeleton className="h-4 w-3/4 mb-5" />
          
          {/* Badges skeleton */}
          <div className="flex gap-2 mb-6 w-full">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>
          
          {/* Chart skeleton */}
          <div className="flex-1 flex flex-col items-center justify-center my-2 w-full min-h-[120px]">
            <Skeleton className="size-[90px] rounded-full" />
            <Skeleton className="h-3 w-24 mt-3" />
          </div>
          
          {/* Stats skeleton */}
          <div className="flex w-full items-center justify-between mt-4 mb-5">
            <div className="space-y-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-1 flex flex-col items-end">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-md mt-auto" />
        </CardContent>
      </Card>
    )
  }

  // null means the API returned 404 — student has no enrolled course
  if (data === null) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg flex flex-col items-center justify-center gap-4 py-10 text-center bg-white dark:bg-card">
        <GraduationCap className="size-10 text-muted-foreground/30" />
        <div>
          <p className="font-semibold text-foreground text-sm">No course enrolled</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You are not enrolled in any course yet.
          </p>
        </div>
        <Button asChild size="lg" className={cn("mt-2", !courses[0] && "opacity-50 pointer-events-none")}>
          <Link
            href={courses[0] ? `/course/${courses[0].id}` : "#"}
            aria-disabled={!courses[0]}
            tabIndex={!courses[0] ? -1 : 0}
          >
            Enroll Now
          </Link>
        </Button>
      </Card>
    )
  }

  // isError = real API error (5xx etc) — show minimal fallback, keep card visible
  if (isError || !data) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg flex flex-col items-center justify-center gap-4 py-10 text-center bg-white dark:bg-card">
        <GraduationCap className="size-10 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">Could not load progress. Please refresh.</p>
      </Card>
    )
  }

  const {
    courseId,
    courseTitle,
    weekNumber,
    weekTitle,
    dayNumber,
    dayTitle,
    weekCompleted,
    weekTotal,
    weekPct,
    completedModules,
    totalModules,
    overallPct,
  } = data

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden py-0 bg-white dark:bg-card flex flex-col flex-1">
      <CardContent className="p-5 flex flex-col items-center text-center flex-1">

        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            Course Progress
          </h2>
          <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Active
          </span>
        </div>

        {/* Course title */}
        <div className="text-left w-full mb-3">
          <p className="text-xs text-foreground font-semibold truncate">{courseTitle}</p>
        </div>

        {/* Week + Day badges */}
        <div className="w-full flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 flex-1">
            <CalendarDays className="size-3 text-primary shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-[9px] text-primary/70 font-semibold uppercase tracking-wider">Week</p>
              <p className="text-xs font-bold text-primary truncate">
                Week {weekNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-violet-500/10 px-2.5 py-1.5 flex-1">
            <Layers className="size-3 text-violet-500 shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-[9px] text-violet-500/70 font-semibold uppercase tracking-wider">Day</p>
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 truncate">
                Day {dayNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Radial chart — week lessons */}
        <div className="flex-1 flex flex-col items-center justify-center my-1 w-full min-h-[120px]">
          <ProgressChart pct={weekPct} />
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">
            This week's lessons
          </p>
        </div>

        {/* Week stats */}
        <div className="flex w-full items-center justify-between mt-3 mb-4">
          <div className="text-left">
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-0.5">Done</p>
            <p className="text-lg font-black text-foreground">
              {weekCompleted} <span className="text-[10px] text-muted-foreground font-medium">lessons</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-0.5">Week Total</p>
            <p className="text-lg font-black text-foreground">
              {weekTotal} <span className="text-[10px] text-muted-foreground font-medium">lessons</span>
            </p>
          </div>
        </div>

        <Button asChild size="lg" className="w-full gap-2 py-2 rounded-md font-bold text-xs mt-auto">
          <Link href={`/course/${courseId}/learn`}>
            {overallPct === 0 ? (
              <>
                Start Learning
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <BookOpen className="size-4" />
                Continue Learning
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
