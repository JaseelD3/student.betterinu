"use client"

import Link from "next/link"
import { ArrowRight, User, BookOpen } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardCourse } from "@/types/dashboard"

type CourseProgressCardProps = {
  course: DashboardCourse
}

export function CourseProgressCard({ course }: CourseProgressCardProps) {
  const href = `/course/${course.id}`

  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-md p-4 ring-1 transition-shadow hover:shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-foreground line-clamp-2 text-sm font-semibold leading-snug">
            {course.title}
          </p>
          {course.instructor && (
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <User className="size-3" />
              {course.instructor}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={href}>
            Continue
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Progress row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {course.completedModules} / {course.totalModules} modules
          </span>
          <span className="text-foreground text-xs font-medium">
            {course.progressPercentage}%
          </span>
        </div>
        <Progress value={course.progressPercentage} className="h-1.5" />
      </div>
    </div>
  )
}

type ContinueLearningSectionProps = {
  courses: DashboardCourse[] | undefined
  isLoading: boolean
}

export function ContinueLearningSection({
  courses,
  isLoading,
}: ContinueLearningSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-foreground text-base font-semibold">
        Continue Learning
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-md p-4 ring-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpen className="text-muted-foreground size-8" />
            <div>
              <p className="text-foreground text-sm font-medium">
                No courses yet
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Contact your admin to get enrolled in a course.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}
