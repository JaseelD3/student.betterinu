import type { CSSProperties } from "react"
import Image from "next/image"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

import { BookOpen, Clock, Laptop, UserRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EnrollButton } from "@/components/course/enroll-button"
import type { Course } from "@/types"

const dmSerif = DM_Serif_Display({ weight: ["400"], subsets: ["latin"] })
const dmSans = DM_Sans({ weight: ["400", "500"], subsets: ["latin"] })

export function CourseHero({ course }: { course: Course }) {
  const lessonCount = course.totalModules
  const projectCount =
    course.weeks
      .flatMap((w) => w.days.flatMap((d) => d.subModules))
      .filter((sm) => sm.type === "exercise" || sm.type === "assignment")
      .length || 8

  return (
    <Card className="overflow-hidden">
      <section className={`px-8 py-8 sm:px-10 ${dmSans.className}`}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
          {/* Left: Content */}
          <div>
            {/* Track badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium tracking-widest text-emerald-700 uppercase">
              <BookOpen className="size-3" aria-hidden />
              Course Track
            </span>

            {/* Title */}
            <h1
              className={`text-foreground mt-4 text-[42px] leading-[1.08] font-normal tracking-tight ${dmSerif.className}`}
              style={
                { "--course-color": `var(${course.color})` } as CSSProperties
              }
            >
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mt-4 max-w-xl text-[15px] leading-relaxed">
              {course.description}
            </p>

            {/* Meta chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]">
                <UserRound className="size-3.5" aria-hidden />
                {course.instructor}
              </span>
              <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]">
                <Clock className="size-3.5" aria-hidden />
                {course.duration}
              </span>
              <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]">
                <Laptop className="size-3.5" aria-hidden />
                {course.level ?? "All levels"}
              </span>
            </div>

            {/* Stats strip */}
            <div className="border-border mt-5 grid grid-cols-3 overflow-hidden rounded-lg border">
              {[
                { label: "Modules", value: `${lessonCount} lessons` },
                { label: "Projects", value: `${projectCount} builds` },
                { label: "Certificate", value: "Included" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-4 py-3 ${i < 2 ? "border-border border-r" : ""}`}
                >
                  <p className="text-muted-foreground/70 text-[11px] tracking-wider uppercase">
                    {stat.label}
                  </p>
                  <p className="text-foreground mt-0.5 text-[14px] font-medium">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="bg-border my-6 h-px" />

            {/* CTA row */}
            <div className="flex items-center gap-4">
              <EnrollButton
                courseId={course.id}
                size="md"
                className="inline-flex w-auto items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-emerald-800"
              />
              <button className="text-muted-foreground hover:text-foreground text-[13px] underline underline-offset-2">
                Preview syllabus →
              </button>
            </div>
          </div>

          {/* Right: Thumbnail */}
          {course.image && (
            <div className="hidden lg:block">
              <Image
                src={course.image}
                alt={course.title}
                width={280}
                height={158}
                className="border-border aspect-video w-full rounded-xl border object-cover"
              />
            </div>
          )}
        </div>
      </section>
    </Card>
  )
}
