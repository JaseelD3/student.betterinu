"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type {
  CourseAssignment,
  StandaloneAssignment,
  AssignmentSubmission,
} from "@/types/assignment"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET  /api/student/course-assignments        → { assignments: [...] }
// GET  /api/student/standalone-assignments    → { assignments: [...] }
// POST /api/student/standalone-assignments/:id/submit → void (204 / { ok: true })

/**
 * All course-linked assignments for the authenticated student.
 * Backend: GET /api/student/course-assignments → { assignments: CourseAssignment[] }
 */
export function useCourseAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments.course(),
    queryFn: async () => {
      const res = await apiClient<{ assignments: CourseAssignment[] }>(
        "/api/student/course-assignments"
      )
      return res.assignments ?? []
    },
    staleTime: 60_000,
  })
}

/**
 * All standalone assignments.
 * Backend: GET /api/student/standalone-assignments → { assignments: StandaloneAssignment[] }
 */
export function useStandaloneAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments.standalone(),
    queryFn: async () => {
      const res = await apiClient<{ assignments: StandaloneAssignment[] }>(
        "/api/student/standalone-assignments"
      )
      return res.assignments ?? []
    },
    staleTime: 60_000,
  })
}

/**
 * Single standalone assignment detail including submission state.
 * NOTE: There is no dedicated GET /api/student/standalone-assignments/:id endpoint.
 * We fetch the full list and filter client-side.
 */
export function useStandaloneAssignment(id: string) {
  return useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryKey: queryKeys.assignments.detail(id),
    queryFn: async () => {
      // NOTE: The API returns snake_case fields; `any[]` matches the runtime shape.
      const res = await apiClient<{ assignments: any[] }>(
        "/api/student/standalone-assignments"
      )
      return (res.assignments ?? []).find((a: any) => a.assignment_id === id) ?? null
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  })
}

type SubmitPayload = {
  submittedText: string
  submittedFiles: { url: string; name: string; type: string }[]
}

/**
 * Submits a standalone assignment. Invalidates the assignment detail and list on success.
 */
export function useSubmitStandaloneAssignment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubmitPayload) => {
      await apiClient<void>(
        `/api/student/standalone-assignments/${encodeURIComponent(id)}/submit`,
        { method: "POST", body: payload }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.standalone(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.standaloneTasks(),
      })
    },
  })
}
