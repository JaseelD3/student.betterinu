"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET  /api/student/progress/[courseId]  → { subModuleIds: string[] }
// POST /api/student/progress-sync        → { ok: true }  (saves full progress blob)

type ProgressDetail = {
  subModuleIds: string[]
}

type MarkLessonPayload = {
  courseId: string
  weekId: string
  moduleId: string
  dayId?: string
}

/**
 * Fetches completed sub-module IDs for a specific course.
 * Backend: GET /api/student/progress/[courseId] → { subModuleIds: string[] }
 */
export function useProgress(courseId: string) {
  return useQuery({
    queryKey: queryKeys.progress.detail(courseId),
    queryFn: async () => {
      const res = await apiClient<ProgressDetail>(
        `/api/student/progress/${encodeURIComponent(courseId)}`
      )
      return res
    },
    enabled: Boolean(courseId),
    staleTime: 60_000,
  })
}

/**
 * Saves progress to the server. Invalidates progress cache on success.
 * Backend: POST /api/student/progress-sync with { progress }
 */
export function useMarkLessonComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MarkLessonPayload) => {
      // Fetch existing progress blob, merge the new moduleId, and save it back
      const existing = await apiClient<{ progress: Record<string, string[]> | null }>(
        "/api/student/progress-sync"
      )
      const current = existing.progress ?? {}
      const courseModules = current[payload.courseId] ?? []
      const updated = {
        ...current,
        [payload.courseId]: Array.from(new Set([...courseModules, payload.moduleId])),
      }
      await apiClient<void>("/api/student/progress-sync", {
        method: "POST",
        body: { progress: updated },
      })
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.detail(variables.courseId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.courses(),
      })
    },
  })
}
