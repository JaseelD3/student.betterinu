"use client"

import { useEffect, useState, useRef } from "react"
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

// Global cache to survive Next.js remounting the page on URL change
let cachedMatch: ModuleMatch | null = null

export default function ModuleViewerPage() {
  const { courseId, weekId, moduleId } = useParams<{
    courseId: string
    weekId: string
    moduleId: string
  }>()
  // Initialize with the cached match so the sidebar never disappears during navigation
  const [match, setMatch] = useState<ModuleMatch | null>(cachedMatch)
  const [error, setError] = useState("")
  // true only while fetching — does NOT blank out the whole page on re-fetch
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    Promise.all([
      studentApi.getCourse(courseId),
      studentApi.getWeek(courseId, weekId),
    ])
      .then(([{ course }, { week }]) => {
        for (const day of week.days) {
          const subModule = day.subModules.find((item) => item.id === moduleId)
          if (subModule) {
            const newMatch = { course, week, day, subModule }
            setMatch(newMatch)
            cachedMatch = newMatch // Update global cache
            setIsLoading(false)
            return
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

  // Only show the full-page loader the very first time (no match data yet)
  if (!match) {
    return (
      <PageWrapper>
        <div className="flex flex-1 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  // On subsequent lesson switches: sidebar stays rendered, content area shows spinner
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
