"use client"

import { useQuery } from "@tanstack/react-query"

import { studentApi } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { Lesson } from "@/types/lesson"

// ── How lessons work in this backend ──────────────────────────────────────────
// Each lesson (subModule) lives inside a Week's days array.
// We fetch only the single week (GET /api/student/courses/:courseId/curriculum/:weekId)
// instead of loading the entire course. weekId is always available in the URL.

/**
 * Fetches a single lesson (subModule) by loading only the required week.
 * Backend: GET /api/student/courses/:courseId/curriculum/:weekId
 */
export function useLesson(
  courseId: string,
  weekId: string,
  moduleId: string
) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(courseId, weekId, moduleId),
    queryFn: async () => {
      const { week } = await studentApi.getWeek(courseId, weekId)
      for (const day of week?.days ?? []) {
        for (const mod of day.subModules ?? []) {
          if (mod.id === moduleId) return mod as unknown as Lesson
        }
      }
      return null
    },
    enabled: Boolean(courseId) && Boolean(weekId) && Boolean(moduleId),
    staleTime: 5 * 60_000,
  })
}
