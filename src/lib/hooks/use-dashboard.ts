"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { DashboardCourse, DashboardAssignment } from "@/types/dashboard"
import type { StandaloneAssignment } from "@/types/assignment"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET /api/student/courses      → { courses: Course[], courseIds: string[] }
// GET /api/student/assignments  → { submissions: AssignmentSubmission[] }
// GET /api/student/standalone-assignments → { assignments: StandaloneAssignment[] }
// GET /api/student/fee          → { enrollments: Enrollment[] }

/**
 * Enrolled courses for the student dashboard tile.
 */
export function useDashboardCourses() {
  return useQuery({
    queryKey: queryKeys.dashboard.courses(),
    queryFn: async () => {
      const res = await apiClient<{ courses: DashboardCourse[] }>(
        "/api/student/courses"
      )
      return res.courses ?? []
    },
    staleTime: 60_000,
  })
}

/**
 * Course assignment submissions for the dashboard assignments panel.
 */
export function useDashboardAssignments() {
  return useQuery({
    queryKey: queryKeys.dashboard.assignments(),
    queryFn: async () => {
      const res = await apiClient<{ submissions: DashboardAssignment[] }>(
        "/api/student/assignments"
      )
      return res.submissions ?? []
    },
    staleTime: 60_000,
  })
}

/**
 * Standalone (non-course) assignments for the dashboard task panel.
 */
export function useDashboardStandaloneTasks() {
  return useQuery({
    queryKey: queryKeys.dashboard.standaloneTasks(),
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
 * Fee summary shown in the dashboard fee card.
 * Backend returns { enrollments: Enrollment[] } — we return the first enrollment.
 */
export function useDashboardFee() {
  return useQuery({
    queryKey: queryKeys.dashboard.fee(),
    queryFn: async () => {
      const res = await apiClient<{ enrollments: unknown[] }>(
        "/api/student/fee"
      )
      return res.enrollments ?? []
    },
    staleTime: 30_000,
  })
}
