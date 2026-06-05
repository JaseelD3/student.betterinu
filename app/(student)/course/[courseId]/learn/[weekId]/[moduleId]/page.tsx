"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LessonViewerClient } from "../../_components/lesson-viewer-client"
import RoboLoader from "@/components/loading/robo-loader"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { studentApi } from "@/lib/api-client"
import type { Course, Day, SubModule, Week } from "@/types"

type ModuleMatch = {
  course: Course
  week: Week
  day: Day
  subModule: SubModule
}

export default function ModuleViewerPage() {
  const { courseId, weekId, moduleId } = useParams<{
    courseId: string
    weekId: string
    moduleId: string
  }>()
  const [match, setMatch] = useState<ModuleMatch | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    studentApi
      .getCourse(courseId)
      .then(({ course }) => {
        for (const week of course.weeks) {
          for (const day of week.days) {
            const subModule = day.subModules.find(
              (item) => item.id === moduleId
            )
            if (subModule && week.id === weekId) {
              setMatch({ course, week, day, subModule })
              setIsLoading(false)
              return
            }
          }
        }

        setError("Lesson not found")
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Lesson not found")
        setIsLoading(false)
      })
  }, [courseId, moduleId, weekId])

  if (error) {
    return (
      <PageWrapper>
        <p className="pt-24 text-center text-sm text-red-600">{error}</p>
      </PageWrapper>
    )
  }

  // Only show full page loader on initial load when we have NO match data to render the sidebar
  if (!match) {
    return (
      <PageWrapper>
        <div className="flex flex-1 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper noPadding className="min-h-0 overflow-hidden pb-16 md:pb-0">
      <LessonViewerClient
        course={match.course}
        day={match.day}
        subModule={match.subModule}
        week={match.week}
        isLoading={isLoading}
      />
    </PageWrapper>
  )
}
