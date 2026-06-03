"use client"

import { useState, useEffect } from "react"
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ChevronRight,
  Loader2,
} from "lucide-react"
import type { QuizSubModuleData, QuizSubModuleQuestion } from "@/types"
import { studentApi } from "@/lib/api-client"

interface QuizResult {
  questionId: string
  correct: boolean
  selectedAnswer: string | number
  explanation?: string
}

interface QuizState {
  answers: Record<string, string | number> // questionId → answer
  submitted: boolean
  score: number
  totalMarks: number
  passed: boolean
  results: QuizResult[]
  attemptCount: number
}

interface QuizViewerProps {
  moduleId: string
  courseId: string
  weekId: string
  dayId: string
  quizData: QuizSubModuleData
  onPass?: () => void // called when student passes; used to trigger progress mark
}

export function QuizViewer({
  moduleId,
  courseId,
  weekId,
  dayId,
  quizData,
  onPass,
}: QuizViewerProps) {
  const [state, setState] = useState<QuizState | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [error, setError] = useState("")

  const questions = quizData.questions || []
  const maxAttempts = quizData.maxAttempts // undefined = unlimited

  // Load previous attempt from API
  useEffect(() => {
    async function load() {
      try {
        const data = await studentApi.getQuizResult<QuizState>(
          moduleId,
          courseId
        )
        if (data.result) {
          setState(data.result)
          setAttemptCount(data.result.attemptCount || 1)
        }
      } catch (_) {
        /* ignore */
      }
      setHistoryLoaded(true)
    }
    load()
  }, [moduleId, courseId])

  function setAnswer(questionId: string, answer: string | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  async function submit() {
    setSubmitting(true)
    setError("")
    try {
      const data = await studentApi.submitQuiz<QuizState>({
        moduleId,
        courseId,
        weekId,
        dayId,
        answers,
      })
      setState(data.result)
      setAttemptCount(data.result.attemptCount || attemptCount + 1)
      if (data.result.passed && onPass) onPass()
    } catch (e: any) {
      console.error("Quiz submit network error:", e)
      setError("Network error — please try again.")
    }
    setSubmitting(false)
  }

  function retry() {
    setState(null)
    setAnswers({})
  }

  // ── Loading state
  if (!historyLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted size-6 animate-spin" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-muted border-default flex flex-col items-center justify-center rounded-md border border-dashed py-20 text-center">
        <HelpCircle className="mb-3 size-10 opacity-40" />
        <p className="font-semibold">No questions yet</p>
        <p className="mt-1 text-xs">
          The instructor hasn't added questions to this quiz.
        </p>
      </div>
    )
  }

  // ── Results view
  if (state?.submitted) {
    const correctCount = state.results.filter((r) => r.correct).length
    const canRetry = !maxAttempts || attemptCount < maxAttempts

    return (
      <div className="space-y-6 pb-10">
        {/* Score Card */}
        <div
          className={`rounded-md border-2 p-6 text-center shadow-sm ${
            state.passed
              ? "border-green-300 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div
            className={`mb-3 inline-flex size-16 items-center justify-center rounded-full ${
              state.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {state.passed ? (
              <Trophy className="size-8 text-green-600" />
            ) : (
              <XCircle className="size-8 text-red-500" />
            )}
          </div>
          <h2
            className={`mb-1 text-2xl font-bold ${state.passed ? "text-primary" : "text-red-700"}`}
          >
            {state.passed ? "Passed!" : "Not Quite"}
          </h2>
          <p className="text-foreground mb-2 text-sm font-semibold">
            {correctCount} / {questions.length} Correct
          </p>
          <p className="text-muted mt-2 text-xs">
            You must get all questions correct to pass.
          </p>
          {attemptCount > 0 && (
            <p className="text-muted mt-1 text-[10px]">
              Attempt #{attemptCount}
              {maxAttempts ? ` of ${maxAttempts}` : ""}
            </p>
          )}
        </div>

        {/* Retry Button */}
        {!state.passed && canRetry && (
          <button
            type="button"
            onClick={retry}
            className="border-primary text-primary hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-md border bg-white py-3 text-sm font-bold transition-colors"
          >
            <RotateCcw className="size-4" /> Retake Quiz
          </button>
        )}
        {!state.passed && !canRetry && (
          <p className="text-muted text-center text-sm">
            You've used all {maxAttempts} attempts. Contact your instructor for
            assistance.
          </p>
        )}

        {/* Per-question results */}
        <div className="space-y-4">
          <h3 className="text-muted text-sm font-bold tracking-widest uppercase">
            Review Answers
          </h3>
          {questions.map((q, idx) => {
            const result = state.results.find((r) => r.questionId === q.id)
            const isCorrect = result?.correct ?? false

            return (
              <div
                key={q.id}
                className={`rounded-md border p-4 ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${isCorrect ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="size-3.5 text-green-600" />
                    ) : (
                      <XCircle className="size-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-semibold">
                      Q{idx + 1}. {q.question}
                    </p>
                    {q.description && (
                      <p className="text-muted mt-0.5 text-xs">
                        {q.description}
                      </p>
                    )}

                    {/* Show answer */}
                    <div className="mt-2 space-y-1">
                      {q.type === "mcq" && (
                        <>
                          <p className="text-xs">
                            <span className="text-muted font-bold">
                              Your answer:
                            </span>{" "}
                            <span
                              className={
                                isCorrect ? "text-primary" : "text-red-600"
                              }
                            >
                              {q.options?.[result?.selectedAnswer as number] ??
                                "—"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-xs">
                              <span className="text-muted font-bold">
                                Correct:
                              </span>{" "}
                              <span className="text-primary">
                                {q.options?.[q.correctIndex ?? 0]}
                              </span>
                            </p>
                          )}
                        </>
                      )}
                      {q.type === "text" && (
                        <>
                          <p className="text-xs">
                            <span className="text-muted font-bold">
                              Your answer:
                            </span>{" "}
                            <span
                              className={
                                isCorrect ? "text-primary" : "text-red-600"
                              }
                            >
                              {(result?.selectedAnswer as string) || "—"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-xs">
                              <span className="text-muted font-bold">
                                Correct:
                              </span>{" "}
                              <span className="text-primary">
                                {q.correctText}
                              </span>
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2">
                        <p className="text-[11px] leading-relaxed text-blue-700">
                          💡 {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Quiz form view
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="border-default bg-surface flex items-center justify-between rounded-md border p-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-purple-500" />
          <div>
            <p className="text-sm font-bold">Quiz</p>
            <p className="text-muted text-xs">
              {questions.length} questions · All correct to pass
            </p>
          </div>
        </div>
        <span className="text-muted text-xs font-semibold">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      {/* Questions */}
      {questions.map((q, idx) => (
        <QuestionBlock
          key={q.id}
          q={q}
          idx={idx}
          answer={answers[q.id]}
          onChange={(ans) => setAnswer(q.id, ans)}
        />
      ))}

      {/* Submit */}
      <button
        type="button"
        onClick={submit}
        disabled={!allAnswered || submitting}
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-sm font-bold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <ChevronRight className="size-4" /> Submit Quiz
          </>
        )}
      </button>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
      {!allAnswered && (
        <p className="text-muted text-center text-xs">
          Answer all {questions.length} questions to submit
        </p>
      )}
    </div>
  )
}

function QuestionBlock({
  q,
  idx,
  answer,
  onChange,
}: {
  q: QuizSubModuleQuestion
  idx: number
  answer: string | number | undefined
  onChange: (ans: string | number) => void
}) {
  return (
    <div className="border-default overflow-hidden rounded-md border bg-white shadow-sm">
      {/* Question header */}
      <div className="bg-surface border-default border-b px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700">
            {idx + 1}
          </span>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {q.question}
            </p>
            {q.description && (
              <p className="text-muted mt-0.5 text-xs">{q.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div className="p-4">
        {q.type === "mcq" ? (
          <div className="space-y-2">
            {(q.options || []).map((opt, oIdx) => (
              <label
                key={oIdx}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all ${
                  answer === oIdx
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-default bg-surface hover:border-primary/40"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answer === oIdx}
                  onChange={() => onChange(oIdx)}
                  className="accent-primary size-4 shrink-0"
                />
                <span className="text-foreground text-sm">{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={(answer as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="border-default bg-surface focus:border-primary focus:ring-primary/10 w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-1"
          />
        )}
      </div>
    </div>
  )
}
