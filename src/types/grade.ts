export type Grade = {
  id: string
  assignmentId: string
  assignmentTitle: string
  courseId: string
  courseTitle: string
  marks: number
  totalMarks: number
  percentage: number
  feedback?: string
  gradedAt: string
}

export type GradeSummary = {
  totalAssignments: number
  graded: number
  pending: number
  averagePercentage: number
  grades: Grade[]
}
