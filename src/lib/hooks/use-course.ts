"use client"

import { useQuery } from "@tanstack/react-query"
import { studentApi } from "@/lib/api-client"

/**
 * Fetches a single course assigned to the authenticated student.
 * Cached under ["course", courseId].
 */
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => studentApi.getCourse(courseId),
    select: (data) => data.course,
    enabled: Boolean(courseId),
    staleTime: 60_000,
  })
}

export function useCurriculumIndex(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId, "curriculum-index"],
    queryFn: () => studentApi.getCurriculumIndex(courseId),
    select: (data) => data.weeks,
    enabled: Boolean(courseId),
    staleTime: 5 * 60_000,
  })
}

export function useWeek(courseId: string, weekId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["course", courseId, "week", weekId],
    queryFn: () => studentApi.getWeek(courseId, weekId),
    select: (data) => data.week,
    enabled: Boolean(courseId) && Boolean(weekId) && enabled,
    staleTime: 5 * 60_000,
  })
}

