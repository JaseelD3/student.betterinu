"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { Quiz, QuizResult, QuizSubmission } from "@/types/quiz"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET  /api/student/quiz?moduleId=&courseId=  → { result: QuizResult | null }
// POST /api/student/quiz                      → { ok: true, result: QuizResult }

/**
 * Returns the latest quiz result for a given module in a course.
 * Backend: GET /api/student/quiz?moduleId=&courseId= → { result: QuizResult | null }
 */
export function useQuiz(moduleId: string, courseId: string) {
  return useQuery({
    queryKey: queryKeys.quiz.detail(courseId, moduleId),
    queryFn: async () => {
      const res = await apiClient<{ result: QuizResult | null }>(
        `/api/student/quiz?moduleId=${encodeURIComponent(moduleId)}&courseId=${encodeURIComponent(courseId)}`
      )
      return res.result ?? null
    },
    enabled: Boolean(moduleId) && Boolean(courseId),
    staleTime: 5 * 60_000,
  })
}

type SubmitQuizPayload = QuizSubmission & {
  courseId: string
  weekId: string
  dayId: string
}

/**
 * Submits quiz answers and invalidates the quiz detail and progress caches.
 * Backend: POST /api/student/quiz → { ok: true, result: QuizResult }
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubmitQuizPayload) => {
      const res = await apiClient<{ ok: boolean; result: QuizResult }>(
        "/api/student/quiz",
        { method: "POST", body: payload }
      )
      return res.result
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.detail(variables.courseId, variables.dayId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.detail(variables.courseId),
      })
    },
  })
}
