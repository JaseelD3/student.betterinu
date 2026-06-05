import type { Metadata } from "next"

import { PageWrapper } from "@/components/layout/page-wrapper"
import { AssignmentDetailClient } from "./_components/assignment-detail-client"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: "Task Details | Betterinu",
    description: `View and submit your assignment.`,
  }
}

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <PageWrapper>
      <AssignmentDetailClient id={id} />
    </PageWrapper>
  )
}
