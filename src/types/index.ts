export type CourseId = string

export type Course = {
  id: CourseId
  title: string
  tagline: string
  description: string
  instructor: string
  duration: string
  totalModules: number
  level: string
  color: string
  icon: string
  weeks: Week[]
  outcomes: string[]
  instructorBio: string
  image: string
}

export type Week = {
  id: string
  title: string
  isLocked: boolean
  days: Day[]
  quiz: Quiz
  isShared?: boolean
}

export type Day = {
  id: string
  label: string
  title: string
  subModules: SubModule[]
  isCompleted: boolean
}

export type MixedBlock =
  | { kind: "video"; title: string; videoUrl: string; description?: string }
  | { kind: "doc"; title: string; content: string }

export type LessonSectionType =
  | "rich_text"
  | "image"
  | "video"
  | "pdf"
  | "link"
  | "task"
  | "columns"

export type LessonSection =
  | {
      id: string
      type: "rich_text"
      content: string
      align?: "left" | "center" | "right"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "image"
      url: string
      caption?: string
      size?: "sm" | "md" | "lg" | "full"
      align?: "left" | "center" | "right"
      captionAlign?: "left" | "center" | "right"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "video"
      url: string
      title?: string
      align?: "left" | "center" | "right"
      size?: "sm" | "md" | "lg" | "full"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "pdf"
      url: string
      filename?: string
      align?: "left" | "center" | "right"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "link"
      title: string
      url: string
      description?: string
      thumbnailUrl?: string
      align?: "left" | "center" | "right"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "task"
      title: string
      description: string
      submissionType: string
      deadline?: string
      align?: "left" | "center" | "right"
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }
  | {
      id: string
      type: "columns"
      columnCount: 2 | 3
      cols: Array<{
        id: string
        type: Exclude<LessonSectionType, "columns" | "task">
        content?: string
        url?: string
        caption?: string
        captionAlign?: string
        size?: string
        title?: string
        filename?: string
        description?: string
        align?: string
      }>
      align?: string
      paddingX?: "none" | "sm" | "md" | "lg" | "xl"
      bgColor?: string
    }

export type QuizSubModuleQuestion = {
  id: string
  type: "mcq" | "text"
  question: string
  description?: string
  options?: string[]
  correctIndex?: number
  correctText?: string
  marks: number
  explanation?: string
}

export type QuizSubModuleData = {
  questions: QuizSubModuleQuestion[]
  passingScore?: number
  maxAttempts?: number
  totalMarks?: number
}

export type AssignmentSubModuleData = {
  title: string
  instructions: string
  dueDate?: string
  totalMarks?: number
  allowedSubmissionTypes: Array<"text" | "file" | "image" | "url">
  requiresApproval: boolean
  attachedFiles?: Array<{ url: string; name: string; type: string }>
  referenceLinks?: Array<{ label: string; url: string }>
}

export type SubModule = {
  id: string
  title: string
  type:
    | "doc"
    | "video"
    | "exercise"
    | "resource"
    | "quiz"
    | "mixed"
    | "assignment"
    | "lesson"
  duration: string
  content?: string | DocContent
  videoUrl?: string
  description?: string
  externalLinks?: ExternalLink[]
  isCompleted: boolean
  blocks?: MixedBlock[]
  quizData?: QuizSubModuleData
  assignmentData?: AssignmentSubModuleData
  attachedFiles?: { url: string; name: string; type: string }[]
  sections?: LessonSection[]
  pagePadding?: "none" | "sm" | "md" | "lg" | "xl"
  pageBgColor?: string
}

export type DocContent = { sections: DocSection[] }

export type DocSection = {
  heading: string
  body: string
  codeExample?: string
  language?: string
  links?: ExternalLink[]
  callout?: { tone: "tip" | "info" | "warning"; text: string }
}

export type ExternalLink = {
  label: string
  url: string
  type: "mdn" | "youtube" | "github" | "article" | "docs"
}

export type Quiz = {
  id: string
  weekId: string
  questions: QuizQuestion[]
  passingScore: number
  maxAttempts: number
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type StudentProgress = {
  enrolledCourses: CourseId[]
  completedSubModules: string[]
  completedDays: string[]
  completedWeeks: string[]
  quizResults: QuizResult[]
  xp: number
  streak: number
  lastStudiedDate: string
  badges: string[]
}

export type QuizResult = {
  courseId: CourseId
  weekId: string
  score: number
  totalQuestions: number
  passed: boolean
  attemptNumber: number
  completedAt: string
}
