export type LessonContent =
  | { kind: "video"; title: string; videoUrl: string; description?: string }
  | { kind: "doc"; title: string; content: string }

export type Lesson = {
  id: string
  title: string
  type: "video" | "doc" | "exercise" | "resource" | "quiz" | "mixed" | "assignment" | "lesson"
  duration: string
  isCompleted: boolean
  description?: string
  content?: LessonContent
  videoUrl?: string
}
