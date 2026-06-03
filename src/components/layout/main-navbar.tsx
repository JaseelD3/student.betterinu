"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { LogOut, Menu, X, ClipboardList, KeyRound, User } from "lucide-react"
import { getClientAuth } from "@/lib/firebase-client"
import { studentApi } from "@/lib/api-client"
import { ChangePasswordModal } from "@/components/shared/change-password-modal"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newTaskCount, setNewTaskCount] = useState(0)
  const [showChangePassword, setShowChangePassword] = useState(false)

  async function handleSignOut() {
    await getClientAuth().signOut()
    window.location.href = "/login"
  }

  // Fetch pending standalone tasks (tasks with no submission yet)
  useEffect(() => {
    studentApi
      .listStandaloneAssignments()
      .then((d) => {
        const assignments = d.assignments ?? []
        const newCount = assignments.filter(
          (a: { submission_id: string | null }) => !a.submission_id
        ).length
        setNewTaskCount(newCount)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <header className="border-default fixed inset-x-0 top-0 z-40 h-[64px] border-b bg-white/98 backdrop-blur-xl">
        <nav
          className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="focus-ring group flex h-9 items-center rounded"
          >
            <Image
              src="/new-logo.svg"
              alt="Betterinu Logo"
              width={120}
              height={36}
              unoptimized
              className="h-full w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="text-secondary absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-[13px] font-medium md:flex">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/assignments"
              className="hover:text-primary relative flex items-center gap-1.5 transition-colors"
            >
              My Tasks
              {newTaskCount > 0 && (
                <span className="bg-primary inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shadow-sm">
                  {newTaskCount}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="hover:text-primary transition-colors"
            >
              My Profile
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/support"
              className="hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Change Password button — desktop */}
            <button
              onClick={() => setShowChangePassword(true)}
              className="border-default text-foreground hover:bg-subtle focus-ring hidden items-center gap-2 rounded-sm border bg-white py-1.5 pr-3.5 pl-2 text-xs font-bold transition-all md:flex"
              aria-label="Change password"
            >
              <span className="bg-subtle grid size-6 place-items-center rounded-sm">
                <KeyRound className="text-muted size-3.5" aria-hidden />
              </span>
              <span className="text-muted hidden sm:inline">
                Change Password
              </span>
            </button>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="border-default text-foreground hover:bg-subtle focus-ring hidden items-center gap-2 rounded-sm border bg-white py-1.5 pr-3.5 pl-2 text-xs font-bold transition-all md:flex"
              aria-label="Sign out"
            >
              <span className="bg-subtle grid size-6 place-items-center rounded-sm">
                <LogOut className="text-muted size-3.5" aria-hidden />
              </span>
              <span className="text-muted hidden sm:inline">Sign out</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="text-secondary hover:text-primary hover:bg-subtle ml-1 flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-default animate-in slide-in-from-top-2 absolute top-[64px] right-0 left-0 border-b bg-white shadow-lg shadow-black/5 md:hidden">
            <div className="text-secondary flex flex-col space-y-4 px-4 py-4 text-[15px] font-medium">
              <Link
                href="/"
                className="hover:text-primary block w-full transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/assignments"
                className="hover:text-primary flex w-full items-center gap-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ClipboardList className="size-4" />
                My Tasks
                {newTaskCount > 0 && (
                  <span className="bg-primary inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                    {newTaskCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="hover:text-primary flex w-full items-center gap-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="size-4" />
                My Profile
              </Link>
              <Link
                href="/about"
                className="hover:text-primary block w-full transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/support"
                className="hover:text-primary block w-full transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="border-default mt-2 space-y-2 border-t pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setShowChangePassword(true)
                  }}
                  className="text-foreground hover:text-primary flex w-full items-center gap-2 py-2 font-bold transition-colors"
                >
                  <KeyRound className="size-4" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleSignOut()
                  }}
                  className="text-foreground flex w-full items-center gap-2 py-2 font-bold transition-colors hover:text-red-600"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}
