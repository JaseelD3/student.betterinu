"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { studentApi } from "@/lib/api-client"

export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events.list(),
    queryFn: () => studentApi.getEvents(),
    staleTime: 5 * 60_000,
  })
}
