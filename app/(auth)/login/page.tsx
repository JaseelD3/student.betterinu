import type { Metadata } from "next"
import { AuthLayout } from "@/components/layout/auth-layout"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Login | LMS",
  description: "Sign in to your Betterinu student account.",
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
