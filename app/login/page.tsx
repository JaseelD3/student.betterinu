"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Eye, EyeOff } from "lucide-react"
import RoboLoader from "@/components/loading/robo-loader"
import { getClientAuth } from "@/lib/firebase-client"
import { studentApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

export default function StudentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const credential = await signInWithEmailAndPassword(
        getClientAuth(),
        email,
        password
      )
      const idToken = await credential.user.getIdToken()

      await studentApi.verifyAccess(idToken)
      router.push("/")
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid email or password."
      if (msg.includes("invalid-credential")) {
        setError("Invalid email or password.")
      } else if (msg.includes("user-disabled")) {
        setError("Access denied. Please contact your admin.")
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-subtle flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="border-default grid overflow-hidden rounded-2xl border bg-white shadow-xl md:grid-cols-2">
          {/* Left: Form */}
          <div className="flex flex-col justify-center p-6 md:p-10">
            <div className="mb-8 text-left">
              {/* <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary mb-4 shadow-sm border border-primary/10">
                <GraduationCap className="size-6" />
              </span> */}
              <h1 className="font-display text-foreground text-3xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-secondary mt-2 text-sm">
                Sign in to your Betterinu student account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-foreground block text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-default bg-surface focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-foreground block text-sm font-semibold"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-default bg-surface focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-3 py-2.5 pr-10 text-sm transition-all focus:ring-2 focus:outline-none"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-11 w-full text-base font-bold text-white"
                disabled={loading}
              >
                {loading ? (
                  <RoboLoader size="xs" className="text-white" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>

          {/* Right: Branding Image */}
          <div className="border-default relative hidden overflow-hidden border-l md:block">
            <Image
              src="/betty-img.png"
              alt="Betterinu Login Branding"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  )
}
