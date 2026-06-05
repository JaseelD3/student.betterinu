import { AssignmentDetailSkeleton } from "./_components/assignment-detail-skeleton"
import { PageWrapper } from "@/components/layout/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <AssignmentDetailSkeleton />
    </PageWrapper>
  )
}
