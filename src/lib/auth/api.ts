import { signInWithEmailAndPassword } from "firebase/auth"
import { getClientAuth } from "@/lib/firebase-client"
import { studentApi } from "@/lib/api-client"
import type { LoginInput } from "@/types/auth"

/**
 * Authenticates the student via Firebase, then verifies backend access.
 * Preserves the existing auth flow — no REST token swap.
 */
export async function loginUser(input: LoginInput): Promise<void> {
  const credential = await signInWithEmailAndPassword(
    getClientAuth(),
    input.email,
    input.password
  )
  const idToken = await credential.user.getIdToken()
  await studentApi.verifyAccess(idToken)
}
