"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { Lesson } from "@/types/lesson"

// ── How lessons work in this backend ──────────────────────────────────────
// There is no dedicated lesson endpoint.
// Lessons (subModules) are embedded inside the course curriculum JSON:
//   GET /api/student/courses/:courseId → { course: { weeks: Week[] } }
// Each Week has days, each day has subModules (which are lessons/quizzes/assignments).

type CourseWithCurriculum = {
  id: string
  weeks: {
    id: string
    days: {
      id: string
      subModules: (Lesson & { id: string })[]
    }[]
  }[]
}

/**
 * Fetches a single lesson (subModule) by extracting it from the course curriculum.
 * Backend: GET /api/student/courses/:courseId → { course } — no dedicated lesson endpoint.
 */
export function useLesson(
  courseId: string,
  weekId: string,
  moduleId: string
) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(courseId, weekId, moduleId),
    queryFn: async () => {
      const res = await apiClient<{ course: CourseWithCurriculum }>(
        `/api/student/courses/${encodeURIComponent(courseId)}`
      )
      // Extract the sub-module from the nested curriculum structure
      for (const week of res.course?.weeks ?? []) {
        if (week.id !== weekId) continue
        for (const day of week.days ?? []) {
          for (const mod of day.subModules ?? []) {
            if (mod.id === moduleId) return mod as Lesson
          }
        }
      }
      return null
    },
    enabled: Boolean(courseId) && Boolean(weekId) && Boolean(moduleId),
    staleTime: 5 * 60_000,
  })
}
