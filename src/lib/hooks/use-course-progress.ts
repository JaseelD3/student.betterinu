"use client"

import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import { fetchCourseProgress } from "@/lib/progress/api"

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: queryKeys.progress.detail(courseId),
    queryFn: () => fetchCourseProgress(courseId),
    enabled: Boolean(courseId),
    staleTime: 30_000,
  })
}
