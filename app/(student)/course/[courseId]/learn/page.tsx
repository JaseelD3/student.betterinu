"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { LearnClient } from "./_components/learn-client"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"
import type { Course } from "@/types"

export default function CourseLearnPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course | null>(null)

  // We only need the course shell (title, meta) here.
  // The full curriculum (weeks/days) is fetched lazily inside LearnClient.
  useEffect(() => {
    studentApi
      .getCourse(courseId)
      .then(({ course: nextCourse }) => setCourse(nextCourse))
      .catch(() => setCourse(null))
  }, [courseId])

  if (!course) {
    return (
      <PageWrapper>
        <div className="flex flex-1 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  return (
    // noPadding — LearnClient applies its own padding so the left sidebar
    // can bleed flush to the left edge while the right column gets p-4 sm:p-6
    <PageWrapper noPadding className="pb-16 md:pb-0">
      <LearnClient courseId={courseId} course={course} />
    </PageWrapper>
  )
}
