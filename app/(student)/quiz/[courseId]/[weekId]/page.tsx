"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { QuizClient } from "@/components/quiz/quiz-client"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"
import type { Course, Week } from "@/types"

export default function QuizPage() {
  const { courseId, weekId } = useParams<{
    courseId: string
    weekId: string
  }>()
  const moduleId = useSearchParams().get("moduleId")
  const [quiz, setQuiz] = useState<{
    course: Course
    week: Week
    moduleTitle: string
    quizData: NonNullable<
      Course["weeks"][number]["days"][number]["subModules"][number]["quizData"]
    >
  } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!moduleId) return

    studentApi
      .getCourse(courseId)
      .then(({ course }) => {
        const week = course.weeks.find((item) => item.id === weekId)
        const quizModule = week?.days
          .flatMap((day) => day.subModules)
          .find((item) => item.id === moduleId)

        if (!week || quizModule?.type !== "quiz" || !quizModule.quizData) {
          setError("Quiz not found")
          return
        }

        setQuiz({
          course,
          week,
          moduleTitle: quizModule.title,
          quizData: quizModule.quizData,
        })
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Quiz not found")
      )
  }, [courseId, moduleId, weekId])

  if (!moduleId) {
    return (
      <PageWrapper>
        <p className="pt-8 text-center text-sm text-red-600">Quiz not found</p>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <p className="pt-8 text-center text-sm text-red-600">{error}</p>
      </PageWrapper>
    )
  }

  if (!quiz) {
    return (
      <PageWrapper>
        <div className="flex h-64 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <QuizClient
        course={quiz.course}
        week={quiz.week}
        quizData={quiz.quizData}
        moduleId={moduleId}
        moduleTitle={quiz.moduleTitle}
      />
    </PageWrapper>
  )
}
