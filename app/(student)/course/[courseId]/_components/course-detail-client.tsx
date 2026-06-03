"use client"

import Link from "next/link"
import { AlertCircle, ChevronRight } from "lucide-react"

import { useCourse } from "@/lib/hooks/use-course"
import { Button } from "@/components/ui/button"

import { CourseDetailSkeleton } from "./course-detail-skeleton"
import { CourseHero } from "./course-hero"
import { CourseStatsCard } from "./course-stats-card"
import { EnrollCtaCard } from "./enroll-cta-card"
import { OutcomesCard } from "./outcomes-card"
import { InstructorCard } from "./instructor-card"
import { SyllabusAccordion } from "./syllabus-accordion"

type CourseDetailClientProps = {
  courseId: string
}

export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const { data: course, isLoading, isError, error } = useCourse(courseId)

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
    <div className="flex min-h-0 w-full flex-col gap-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex items-center gap-1.5 text-xs"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 opacity-50" aria-hidden />
        <span className="text-foreground font-medium">{course.title}</span>
      </nav>

      {/* Hero */}
      <CourseHero course={course} />

      {/* Body — two-column on desktop */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main: Syllabus */}
        <SyllabusAccordion course={course} />

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <CourseStatsCard course={course} />
          <OutcomesCard course={course} />
          <InstructorCard course={course} />
          <EnrollCtaCard courseId={course.id} />
        </aside>
      </div>
    </div>
  )
}
