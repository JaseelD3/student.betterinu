"use client"

import { useEffect, useState, useCallback } from "react"
import type { Course, Week } from "@/types"
import type { WeekStub } from "@/lib/api-client"
import { studentApi } from "@/lib/api-client"
import { useProgress } from "@/lib/hooks/useProgress"
import { LockedWeekCard } from "./locked-week-card"
import { WeekCard } from "./week-card"
import { Sidebar } from "./main-sidebar"

// ── Dummy stub for the "Coming Soon" padding weeks ────────────────────────────
function makeDummyStub(index: number): WeekStub {
  return {
    id: `dummy-week-${index + 1}`,
    course_id: "",
    position: index,
    title: `Week ${index + 1}: Coming Soon`,
    is_locked: true,
    is_shared: false,
  }
}

export function LearnClient({
  courseId,
  course,
}: {
  courseId: string
  course: Course
}) {
  const { isWeekUnlocked } = useProgress()

  // Week stubs from the index endpoint (no days payload)
  const [weekStubs, setWeekStubs] = useState<WeekStub[]>([])
  // Lazily-loaded full weeks keyed by weekId
  const [weekCache, setWeekCache] = useState<Record<string, Week>>({})
  // Which week is currently being fetched
  const [loadingWeekId, setLoadingWeekId] = useState<string | null>(null)

  // ── Fetch stubs on mount ──────────────────────────────────────────────────
  useEffect(() => {
    studentApi
      .getCurriculumIndex(courseId)
      .then(({ weeks }) => setWeekStubs(weeks))
      .catch(() => {
        // Fallback: if course still carries weeks (legacy), build stubs from them
        if (course.weeks?.length) {
          setWeekStubs(
            course.weeks.map((w, i) => ({
              id: w.id,
              course_id: courseId,
              position: i,
              title: w.title,
              is_locked: w.isLocked,
              is_shared: w.isShared ?? false,
            }))
          )
          // Pre-populate cache from the course object so nothing re-fetches
          const cache: Record<string, Week> = {}
          for (const w of course.weeks) cache[w.id] = w
          setWeekCache(cache)
        }
      })
  }, [courseId, course.weeks])

  // ── Lazy-load a single week ───────────────────────────────────────────────
  const handleWeekExpand = useCallback(
    async (weekId: string) => {
      if (weekCache[weekId] || loadingWeekId === weekId) return
      setLoadingWeekId(weekId)
      try {
        const { week } = await studentApi.getWeek(courseId, weekId)
        setWeekCache((prev) => ({ ...prev, [weekId]: week }))
      } catch {
        // silently ignore — the skeleton stays until next attempt
      } finally {
        setLoadingWeekId(null)
      }
    },
    [courseId, weekCache, loadingWeekId]
  )

  // ── Pad stubs to 30 to show upcoming locked weeks ─────────────────────────
  const paddedStubs: WeekStub[] = Array.from({ length: 30 }).map((_, idx) =>
    idx < weekStubs.length ? weekStubs[idx] : makeDummyStub(idx)
  )

  // Build a fake Course shell for helpers that need it (e.g. isWeekUnlocked)
  // We pass the cached weeks so the lock logic still works
  const paddedCourse: Course = {
    ...course,
    weeks: paddedStubs.map((stub) => ({
      id: stub.id,
      title: stub.title,
      isLocked: stub.is_locked,
      isShared: stub.is_shared,
      days: weekCache[stub.id]?.days ?? [],
      quiz: weekCache[stub.id]?.quiz ?? ({ id: "", weekId: stub.id, questions: [], passingScore: 70, maxAttempts: 3 } as any),
    })),
  }

  // Determine the first unlocked real week for the sidebar default open value
  const activeWeek = paddedCourse.weeks.find(
    (w) => isWeekUnlocked(paddedCourse, w.id) && !w.id.startsWith("dummy")
  ) ?? paddedCourse.weeks[0]

  return (
    <div className="flex min-h-0 w-full">
      {/* Left sidebar — stub-driven, lazy expanding */}
      <Sidebar
        courseId={courseId}
        weekStubs={paddedStubs}
        weekCache={weekCache}
        loadingWeekId={loadingWeekId}
        activeWeekId={activeWeek?.id}
        onWeekExpand={handleWeekExpand}
      />

      {/* Right content */}
      <div className="min-w-0 flex-1 space-y-6 p-4 sm:p-5">
        {/* Course header */}
        <div className="bg-card ring-foreground/10 rounded-md ring-1">
          <div className="px-4 py-3">
            <p className="text-primary text-[11px] font-bold tracking-widest uppercase">
              Course Material
            </p>
            <h1 className="text-foreground mt-0.5 text-base font-bold leading-snug truncate">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Week cards — lazy rendered from cache */}
        {paddedStubs.map((stub, index) => {
          const isDummy = stub.id.startsWith("dummy")
          const weekShell = paddedCourse.weeks[index]
          const unlocked = isWeekUnlocked(paddedCourse, stub.id)

          if (isDummy || !unlocked) {
            return (
              <LockedWeekCard
                key={stub.id}
                previousWeekNumber={index}
                week={weekShell as any}
              />
            )
          }

          // Unlocked real week — show card, trigger load on first render
          const week = weekCache[stub.id] ?? null
          if (!week && loadingWeekId !== stub.id) {
            // Auto-load the first visible unlocked week
            handleWeekExpand(stub.id)
          }

          return (
            <WeekCard
              courseId={paddedCourse.id}
              key={stub.id}
              week={week ?? (weekShell as any)}
              isLoading={!week}
            />
          )
        })}
      </div>
    </div>
  )
}
