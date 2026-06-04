"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { Course, CourseDetail } from "@/types/course"

/**
 * Returns the list of courses the student is enrolled in.
 * Backend: GET /api/student/courses → { courses: Course[], courseIds: string[] }
 */
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: async () => {
      const res = await apiClient<{ courses: Course[] }>("/api/student/courses")
      return res.courses ?? []
    },
    staleTime: 60_000,
  })
}

/**
 * Returns a single course with full week/module detail.
 * Backend: GET /api/student/courses/:id → { course: CourseDetail }
 */
export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: async () => {
      const res = await apiClient<{ course: CourseDetail }>(
        `/api/student/courses/${encodeURIComponent(courseId)}`
      )
      return res.course
    },
    enabled: Boolean(courseId),
    staleTime: 60_000,
  })
}
