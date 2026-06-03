"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { LearnClient } from "@/components/learn/learn-client"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"
import type { Course } from "@/types"

export default function CourseLearnPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    studentApi
      .getCourse(courseId)
      .then(({ course: nextCourse }) => setCourse(nextCourse))
      .catch(() => setCourse(null))
  }, [courseId])

  if (!course) {
    return (
      <PageWrapper>
        <div className="flex h-64 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl">
        <LearnClient course={course} />
      </div>
    </PageWrapper>
  )
}
