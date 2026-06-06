import { apiClient } from "@/lib/api-client"

export type CourseProgress = {
  subModuleIds: string[]
}

export async function fetchCourseProgress(
  courseId: string
): Promise<CourseProgress> {
  return apiClient<CourseProgress>(
    `/api/student/progress/${encodeURIComponent(courseId)}`
  )
}
