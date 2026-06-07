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
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden py-0 bg-white dark:bg-card flex-1 flex flex-col">
        <CardContent className="p-6 flex flex-col items-center flex-1 justify-center gap-6">
          <Skeleton className="size-[160px] rounded-full" />
          <div className="w-full space-y-2 text-center flex flex-col items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-10 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg flex flex-col items-center justify-center gap-3 py-14 text-center flex-1 bg-white dark:bg-card">
        <GraduationCap className="size-10 text-muted-foreground/30" />
        <div>
          <p className="font-semibold text-foreground">No course enrolled</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Contact your admin to get enrolled.
          </p>
        </div>
      </Card>
    )
  }

  const { courseId, courseTitle, completionPercentage, completedModules, totalModules } = data
  const pct = completionPercentage

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden py-0 bg-white dark:bg-card flex flex-col flex-1">
      <CardContent className="p-6 flex flex-col items-center text-center flex-1">
        <div className="w-full flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-foreground">Course Progress</h2>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Active
          </span>
        </div>

        <div className="text-left w-full mb-6">
          <p className="text-[10px] text-muted-foreground font-medium truncate">{courseTitle}</p>
        </div>

        {/* Big Radial Chart */}
        <div className="flex-1 flex items-center justify-center min-h-[180px] w-full">
          <div className="scale-125 transform">
            <ProgressChart pct={pct} />
          </div>
        </div>

        <div className="flex w-full items-center justify-between mt-6 mb-6">
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Completed</p>
            <p className="text-xl font-black text-foreground">{completedModules} <span className="text-xs text-muted-foreground font-medium">lessons</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Total</p>
            <p className="text-xl font-black text-foreground">{totalModules} <span className="text-xs text-muted-foreground font-medium">lessons</span></p>
          </div>
        </div>

        <Button asChild size="lg" className="w-full gap-2 rounded-md font-bold">
          <Link href={`/course/${courseId}/learn`}>
            {pct === 0 ? (
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
