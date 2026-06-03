"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, X, CheckCircle } from "lucide-react"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"

import { getClientAuth } from "@/lib/firebase-client"

interface ChangePasswordModalProps {
  onClose: () => void
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.")
      return
    }

    setLoading(true)
    try {
      const user = getClientAuth().currentUser
      if (!user?.email) throw new Error("Please sign in again.")
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword)
      )
      await updatePassword(user, newPassword)
      setSuccess(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="backdrop-blur- animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="border-default animate-in zoom-in-95 w-full max-w-md rounded-md border bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="border-default flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
              <Lock className="text-primary size-4" />
            </div>
            <h2 className="text-foreground text-base font-bold">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:bg-subtle hover:text-foreground rounded-md p-1.5 transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <div>
                <p className="text-foreground text-base font-bold">
                  Password updated!
                </p>
                <p className="text-secondary mt-1 text-sm">
                  Your password has been changed successfully.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-primary mt-2 rounded-md px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <label className="text-foreground block text-sm font-semibold">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="border-default bg-surface focus:border-primary focus:ring-primary/20 w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-all focus:ring-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showCurrent ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-foreground block text-sm font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="border-default bg-surface focus:border-primary focus:ring-primary/20 w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-all focus:ring-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showNew ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div className="space-y-1.5">
                <label className="text-foreground block text-sm font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    className="border-default bg-surface focus:border-primary focus:ring-primary/20 w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-all focus:ring-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="border-default text-secondary hover:bg-subtle flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary flex-1 rounded-md px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
