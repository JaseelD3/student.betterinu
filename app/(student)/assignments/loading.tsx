import { AssignmentsSkeleton } from "./_components/assignments-skeleton"
import { PageWrapper } from "@/components/layout/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <AssignmentsSkeleton />
    </PageWrapper>
  )
}
