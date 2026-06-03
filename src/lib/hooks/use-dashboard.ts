"use client"

import { useQuery } from "@tanstack/react-query"
import { studentApi } from "@/lib/api-client"

/**
 * Courses the student is enrolled in.
 * Cached under ["dashboard", "courses"].
 */
export function useDashboardCourses() {
  return useQuery({
    queryKey: ["dashboard", "courses"],
    queryFn: () => studentApi.listCourses(),
    select: (data) => data.courses ?? [],
    staleTime: 60_000,
  })
}

/**
 * All assignment submissions for the student.
 * Cached under ["dashboard", "assignments"].
 */
export function useDashboardAssignments() {
  return useQuery({
    queryKey: ["dashboard", "assignments"],
    queryFn: () => studentApi.listAssignments(),
    select: (data) => data.submissions ?? [],
    staleTime: 60_000,
  })
}

/**
 * All standalone (non-course) assignments.
 * Cached under ["dashboard", "standalone-tasks"].
 */
export function useDashboardStandaloneTasks() {
  return useQuery({
    queryKey: ["dashboard", "standalone-tasks"],
    queryFn: () => studentApi.listStandaloneAssignments(),
    select: (data) => data.assignments ?? [],
    staleTime: 60_000,
  })
}
