import type { Metadata } from "next"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { CourseDetailClient } from "./_components/course-detail-client"

type PageProps = {
  params: Promise<{ courseId: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params
  return {
    title: `Course | Betterinu`,
    description: `View course details and curriculum for ${courseId}.`,
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params

  return (
    <PageWrapper>
      <CourseDetailClient courseId={courseId} />
    </PageWrapper>
  )
}
