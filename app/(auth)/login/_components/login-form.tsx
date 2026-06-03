"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

import { useLogin } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, error } = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginFormValues) {
    login(values)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="mb-6">
          <Image
            src="/new-logo.svg"
            alt="Betterinu Logo"
            width={120}
            height={36}
            unoptimized
            className="h-9 w-auto object-contain"
          />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your Betterinu student account
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm font-semibold">
                  Email address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••"
                      className="pr-10 pl-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
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
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormMessage />
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    className="text-muted-foreground hover:text-foreground ml-auto h-auto px-0 py-0 text-xs font-normal transition-colors"
                  >
                    Forgot password?
                  </Button>
                </div>
              </FormItem>
            )}
          />

          {/* API / Firebase error */}
          {error && (
            <p className="text-destructive text-sm font-medium">
              {error instanceof Error
                ? formatError(error.message)
                : "Invalid email or password."}
            </p>
          )}

          <Button
            id="login-submit"
            type="submit"
            size="default"
            className="h-11 w-full text-base font-bold"
            disabled={isPending}
          >
            {isPending ? "Signing in…" : "Get Started"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

function formatError(message: string): string {
  if (message.includes("invalid-credential"))
    return "Invalid email or password."
  if (message.includes("user-disabled"))
    return "Access denied. Please contact your admin."
  return message
}
