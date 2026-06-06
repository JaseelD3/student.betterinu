"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

import { useDashboardProgress } from "@/lib/hooks/use-dashboard-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type ProgressChartProps = { pct: number }

function ProgressChart({ pct }: ProgressChartProps) {
  return (
    <ResponsiveContainer width={120} height={120}>
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
          fontSize={20}
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
  const { data, isLoading, isError } = useDashboardProgress()

  if (isLoading) {
    return (
      <Card className="overflow-hidden py-0">
        <Skeleton className="h-36 w-full rounded-none" />
        <CardContent className="p-5">
          <div className="flex items-center gap-6">
            <Skeleton className="size-[120px] shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-9 w-36 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <GraduationCap className="size-10 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">No course enrolled</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Contact your admin to get enrolled.
          </p>
        </div>
      </Card>
    )
  }

  const { courseId, courseTitle, thumbnailUrl, completionPercentage, completedModules, totalModules } = data
  const pct = completionPercentage

  return (
    <Card className="overflow-hidden py-0">
      {/* Primary top bar */}
      <div className="bg-primary px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-widest text-primary-foreground/60 uppercase">
              Continue Learning
            </p>
            <h2 className="mt-1 text-xl font-bold leading-snug text-primary-foreground sm:text-2xl">
              {courseTitle}
            </h2>
          </div>

          {thumbnailUrl ? (
            <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-md sm:block">
              <Image src={thumbnailUrl} alt={courseTitle} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="hidden size-20 shrink-0 items-center justify-center rounded-md bg-primary-foreground/10 sm:flex">
              <GraduationCap className="size-10 text-primary-foreground/40" />
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-5 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="shrink-0">
            <ProgressChart pct={pct} />
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completedModules}
                <span className="text-base font-medium text-muted-foreground">/{totalModules}</span>
              </p>
              <p className="text-sm text-muted-foreground">lessons completed</p>
            </div>

            <Button asChild size="sm" className="gap-1.5">
              <Link href={`/course/${courseId}/learn`}>
                {pct === 0 ? (
                  <>
                    Start Learning
                    <ArrowRight className="size-3.5" />
                  </>
                ) : (
                  <>
                    <BookOpen className="size-3.5" />
                    Continue Learning
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
