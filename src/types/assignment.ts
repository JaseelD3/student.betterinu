export type SubmissionStatus = "todo" | "pending" | "approved" | "rejected"

export type AssignmentSubmission = {
  id: string
  assignmentId: string
  courseId: string
  weekId: string
  dayId: string
  submittedText: string
  submittedAt: string
  status: SubmissionStatus
  feedback?: string
  submittedFiles?: { url: string; name: string; type: string }[]
}

export type CourseAssignment = {
  id: string
  title: string
  instructions: string
  courseId: string
  courseTitle: string
  weekId: string
  dayId: string
  dueDate?: string
  totalMarks?: number
  allowedSubmissionTypes: string[]
  submission?: AssignmentSubmission | null
}

export type StandaloneAssignment = {
  assignmentId: string
  title: string
  instructions: string
  dueDate: string | null
  totalMarks: number | null
  allowedSubmissionTypes: string[]
  attachedFiles: { url: string; name: string; type: string }[]
  referenceLinks: { label: string; url: string }[]
  scope: "course" | "common"
  courseTitle: string | null
  submissionId: string | null
  submittedText: string | null
  submittedFiles: { url: string; name: string; type: string }[] | null
  submittedAt: string | null
  submissionStatus: SubmissionStatus | null
  feedback: string | null
}

export type Assignment = CourseAssignment | StandaloneAssignment
