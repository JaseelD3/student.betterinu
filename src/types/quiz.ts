export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  marks: number
}

export type Quiz = {
  id: string
  weekId: string
  courseId: string
  questions: QuizQuestion[]
  passingScore: number
  maxAttempts: number
  totalMarks: number
}

export type QuizSubmission = {
  answers: Record<string, number>
  submittedAt: string
  attemptNumber: number
}

export type QuizResult = {
  courseId: string
  weekId: string
  score: number
  totalQuestions: number
  totalMarks: number
  passed: boolean
  attemptNumber: number
  completedAt: string
  feedback?: string
}
