"use client"

import { useEffect, useState } from "react"
import {
  BookOpenCheck,
  CheckCircle2,
  Flame,
  BookLock,
  LogOut,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useProgress } from "@/lib/hooks/useProgress"
import { getClientAuth } from "@/lib/firebase-client"
import { studentApi } from "@/lib/api-client"
import { EnrolledCourseCard } from "./enrolled-course-card"
import { AssignmentsList } from "./assignments-list"
import { StreakBanner } from "./streak-banner"
import RoboLoader from "@/components/loading/robo-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Course } from "@/types"
import type { User } from "firebase/auth"

export function DashboardClient() {
  const { progress } = useProgress()
  const [enrolled, setEnrolled] = useState<Course[] | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = getClientAuth().onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    studentApi
      .listCourses()
      .then((d) => setEnrolled(d.courses ?? []))
      .catch(() => setEnrolled([]))
  }, [])

  const xpToNextLevel = 500 - (progress.xp % 500)

  async function handleSignOut() {
    await getClientAuth().signOut()
    window.location.href = "/login"
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <header className="border-border flex items-end justify-between border-b pb-6">
        <div>
          <p className="text-primary text-xs font-bold tracking-widest uppercase">
            Student Portal
          </p>
          <h1 className="font-display mt-1 text-4xl font-bold tracking-tight">
            {user?.displayName
              ? `Welcome, ${user.displayName.split(" ")[0]}`
              : "Your Dashboard"}
          </h1>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="size-3.5" />
          Sign Out
        </Button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* XP Card — green accent */}
        <Card className="border-primary bg-primary text-primary-foreground col-span-2 shadow-md lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold tracking-widest text-green-200 uppercase">
                Total XP
              </CardTitle>
              <Sparkles className="size-4 text-green-300" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">{progress.xp}</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${((progress.xp % 500) / 500) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-green-200">
              {xpToNextLevel} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Streak
              </CardTitle>
              <Flame className="size-4 text-orange-500" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">{progress.streak}</p>
            <p className="text-muted-foreground mt-1 text-xs">Days in a row</p>
          </CardContent>
        </Card>

        {/* Courses card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Enrolled
              </CardTitle>
              <BookOpenCheck className="text-primary size-4" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">
              {enrolled?.length ?? "—"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">Active courses</p>
          </CardContent>
        </Card>

        {/* Lessons card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Completed
              </CardTitle>
              <CheckCircle2 className="size-4 text-green-600" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">
              {progress.completedSubModules.length}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">Lessons done</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak Banner */}
      <StreakBanner streak={progress.streak} />

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Courses section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Enrolled Courses</h2>
            <TrendingUp className="text-muted-foreground size-4" />
          </div>
          {enrolled === null ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <Skeleton className="mb-2 h-5 w-2/3" />
                    <Skeleton className="mt-4 h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrolled.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <BookLock className="text-muted-foreground mb-3 size-10" />
                <h3 className="font-display text-lg font-bold">
                  No courses assigned
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Contact your admin to get enrolled in a course.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {enrolled.map((course) => (
                <EnrolledCourseCard course={course} key={course.id} />
              ))}
            </div>
          )}
        </section>

        {/* Assignments Section */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Your Assignments</h2>
          </div>
          <AssignmentsList enrolledCourses={enrolled} />
        </section>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Profile card */}
          <Card>
            <CardHeader className="border-border border-b pb-3">
              <CardTitle className="text-primary text-xs font-bold tracking-widest uppercase">
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-border size-11 border">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {(user.displayName || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.displayName || "Betterinu Student"}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-muted rounded-sm p-2">
                      <p className="text-sm font-bold">{progress.xp}</p>
                      <p className="text-muted-foreground">XP</p>
                    </div>
                    <div className="bg-muted rounded-sm p-2">
                      <p className="text-sm font-bold">{progress.streak}d</p>
                      <p className="text-muted-foreground">Streak</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-center text-[10px]">
                    Member since{" "}
                    {new Date(
                      user.metadata.creationTime || Date.now()
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center py-6">
                  <RoboLoader size="sm" />
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
