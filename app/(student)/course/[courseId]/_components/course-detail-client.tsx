"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { useCourse, useCurriculumIndex } from "@/lib/hooks/use-course"
import { Button } from "@/components/ui/button"

import { CourseDetailSkeleton } from "./course-detail-skeleton"
import { CourseHero } from "./course-hero"
import { SyllabusAccordion } from "./syllabus-accordion"

type CourseDetailClientProps = {
  courseId: string
}

export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const { data: course, isLoading, isError, error } = useCourse(courseId)
  const { data: weeks = [] } = useCurriculumIndex(courseId)

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 p-8">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" aria-hidden />
        </div>
        <div className="text-center">
          <p className="text-foreground text-sm font-semibold">
            Could not load course
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {error instanceof Error ? error.message : "Course not found."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Hero */}
      <CourseHero course={course} />

      {/* Body — Full width weekly curriculum */}
      <div className="w-full">
        <SyllabusAccordion course={course} weeks={weeks} />
      </div>
    </div>
  )
}
