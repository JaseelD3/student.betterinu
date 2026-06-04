"use client"

// NOTE: The backend does NOT have a grades endpoint yet.
// This hook is a stub that returns empty data so the UI doesn't crash.

export type GradeSummary = {
  courseId: string
  courseTitle: string
  totalAssignments: number
  approvedAssignments: number
  pendingAssignments: number
  rejectedAssignments: number
  averageScore: number | null
}

/**
 * Returns the student's full grade summary including individual grades.
 * NOTE: Backend endpoint not yet implemented — returns empty array.
 */
export function useGrades() {
  return {
    data: [] as GradeSummary[],
    isLoading: false,
    isError: false,
  }
}
