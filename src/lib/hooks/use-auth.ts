"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth/api"
import type { LoginInput } from "@/types/auth"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: () => {
      router.push("/")
    },
  })
}
