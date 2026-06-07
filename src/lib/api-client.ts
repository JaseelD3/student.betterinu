import { getClientAuth } from "@/lib/firebase-client"

import type { AttachedFile } from "@/components/ui/FileUploader"
import type { Course, StudentProgress, Week } from "@/types"

/** Lightweight week descriptor returned by the curriculum-index endpoint.
 *  Contains only the fields needed to render the sidebar without fetching
 *  the full week payload (no days, no quiz). */
export type WeekStub = {
  id: string
  course_id: string
  position: number
  title: string
  is_locked: boolean
  is_shared: boolean
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object
  requireAuth?: boolean
}

export type AssignmentSubmission = {
  id: string
  assignment_id: string
  course_id: string
  week_id: string
  day_id: string
  course_title: string
  submitted_text: string
  submitted_at: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
  submitted_files?: AttachedFile[]
}

export type StandaloneAssignment = {
  assignment_id: string
  title: string
  instructions: string
  due_date: string | null
  total_marks: number | null
  allowed_submission_types: string[]
  attached_files: AttachedFile[]
  reference_links: { label: string; url: string }[]
  scope: "course" | "common"
  course_title: string | null
  submission_id: string | null
  submitted_text: string | null
  submitted_files: AttachedFile[] | null
  submitted_at: string | null
  submission_status: "pending" | "approved" | "rejected" | null
  feedback: string | null
}

function getApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // If API URL is not set, use relative paths (proxied by next.config.ts in dev)
  if (!apiUrl) {
    return normalizedPath
  }

  return `${apiUrl.replace(/\/$/, "")}${normalizedPath}`
}

export async function apiClient<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, headers, requireAuth = true, ...restOptions } = options
  const requestHeaders = new Headers(headers)

  if (requireAuth) {
    const user = getClientAuth().currentUser
    if (!user) {
      throw new Error("You must sign in to continue")
    }

    requestHeaders.set("Authorization", `Bearer ${await user.getIdToken()}`)
  }

  const isJsonBody =
    body !== undefined &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    typeof body !== "string"

  if (isJsonBody) {
    requestHeaders.set("Content-Type", "application/json")
  }

  const response = await fetch(getApiUrl(path), {
    ...restOptions,
    headers: requestHeaders,
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new Error(errorBody?.error ?? `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const studentApi = {
  // TODO(external-api): POST /api/student/auth/verify with { idToken }.
  verifyAccess(idToken: string) {
    return apiClient<{ ok: true }>("/api/student/auth/verify", {
      method: "POST",
      body: { idToken },
    })
  },

  listCourses() {
    return apiClient<{ courses: Course[] }>("/api/student/courses")
  },

  // TODO(external-api): GET /api/student/courses/:courseId returns { course: Course }.
  getCourse(courseId: string) {
    return apiClient<{ course: Course }>(
      `/api/student/courses/${encodeURIComponent(courseId)}`
    )
  },

  /** GET /api/student/courses/:courseId/curriculum
   *  Returns the ordered week-stub list (no days, no quiz payload). */
  getCurriculumIndex(courseId: string) {
    return apiClient<{ weeks: WeekStub[] }>(
      `/api/student/courses/${encodeURIComponent(courseId)}/curriculum`
    )
  },

  /** GET /api/student/courses/:courseId/curriculum/:weekId
   *  Returns the full week row including days + quiz. */
  getWeek(courseId: string, weekId: string) {
    return apiClient<{ week: Week }>(
      `/api/student/courses/${encodeURIComponent(courseId)}/curriculum/${encodeURIComponent(weekId)}`
    )
  },

  listAssignments(params?: { assignmentId?: string; courseId?: string }) {
    const search = new URLSearchParams()
    if (params?.assignmentId) search.set("assignmentId", params.assignmentId)
    if (params?.courseId) search.set("courseId", params.courseId)
    const query = search.size ? `?${search}` : ""

    return apiClient<{
      submission?: AssignmentSubmission | null
      submissions?: AssignmentSubmission[]
    }>(`/api/student/assignments${query}`)
  },

  submitAssignment(payload: {
    assignmentId: string
    courseId: string
    weekId: string
    dayId: string
    submittedText: string
    submittedFiles: AttachedFile[]
  }) {
    return apiClient<{ submission: AssignmentSubmission }>(
      "/api/student/assignments",
      { method: "POST", body: payload }
    )
  },

  listStandaloneAssignments() {
    return apiClient<{ assignments: StandaloneAssignment[] }>(
      "/api/student/standalone-assignments"
    )
  },

  listCourseAssignments<T>() {
    return apiClient<{ assignments: T[] }>("/api/student/course-assignments")
  },

  submitStandaloneAssignment(
    assignmentId: string,
    payload: { submittedText: string; submittedFiles: AttachedFile[] }
  ) {
    return apiClient<void>(
      `/api/student/standalone-assignments/${encodeURIComponent(assignmentId)}/submit`,
      { method: "POST", body: payload }
    )
  },

  getProfile<T>() {
    return apiClient<T>("/api/student/profile")
  },

  getProgress() {
    return apiClient<{ progress: StudentProgress }>(
      "/api/student/progress-sync"
    )
  },

  saveProgress(progress: StudentProgress) {
    return apiClient<void>("/api/student/progress-sync", {
      method: "POST",
      body: { progress },
    })
  },

  getQuizResult<T>(moduleId: string, courseId: string) {
    const search = new URLSearchParams({ moduleId, courseId })
    return apiClient<{ result?: T }>(`/api/student/quiz?${search}`)
  },

  submitQuiz<T>(payload: {
    moduleId: string
    courseId: string
    weekId: string
    dayId: string
    answers: Record<string, string | number>
  }) {
    return apiClient<{ result: T }>("/api/student/quiz", {
      method: "POST",
      body: payload,
    })
  },

  uploadFile(folder: string, file: File) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    return apiClient<AttachedFile>("/api/upload?role=student", {
      method: "POST",
      body: formData,
    })
  },

  getFee<T>() {
    return apiClient<T>("/api/student/fee")
  },

  getReceipt<T>(paymentLogId: string) {
    return apiClient<T>(`/api/receipts/${encodeURIComponent(paymentLogId)}`)
  },

  getFines() {
    return apiClient<{
      fines: {
        id: string
        fine_type: "absent" | "leave"
        period_label: string
        fine_amount: number
        status: "pending" | "paid" | "waived"
        waive_reason: string | null
        leave_date: string | null
        absent_date: string | null
        created_at: string
      }[]
    }>("/api/student/fines")
  },

  getEvents() {
    return apiClient<{
      events: {
        id: string
        title: string
        description: string | null
        date: string
        time: string | null
        location: string | null
      }[]
    }>("/api/student/events")
  },
}
