"use client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        About Us
      </h1>
      <p className="text-secondary mt-4 text-lg">Coming Soon</p>
      <Link
        href="/"
        className="text-primary mt-8 flex items-center gap-2 text-sm font-semibold hover:underline"
      >
        <ChevronLeft className="size-4" />
        Back to Home
      </Link>
    </main>
  )
}
