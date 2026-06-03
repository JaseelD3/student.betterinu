"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LessonViewerClient } from "@/components/learn/lesson-viewer-client"
import RoboLoader from "@/components/loading/robo-loader"
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

  useEffect(() => {
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
              return
            }
          }
        }

        setError("Lesson not found")
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Lesson not found")
      )
  }, [courseId, moduleId, weekId])

  if (error) {
    return <p className="pt-24 text-center text-sm text-red-600">{error}</p>
  }

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RoboLoader size="md" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden pt-[72px]">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <LessonViewerClient
          course={match.course}
          day={match.day}
          subModule={match.subModule}
          week={match.week}
        />
      </div>
    </div>
  )
}
