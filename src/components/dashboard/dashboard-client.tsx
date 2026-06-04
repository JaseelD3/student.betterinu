"use client"

/**
 * DashboardClient — legacy wrapper kept for backwards compat.
 * All dashboard rendering is now handled by DashboardShell.
 * This file no longer contains any useEffect, direct API calls, or Firebase listeners.
 */
export { DashboardShell as DashboardClient } from "@/components/dashboard/dashboard-shell"
