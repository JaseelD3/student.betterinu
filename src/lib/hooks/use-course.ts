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
