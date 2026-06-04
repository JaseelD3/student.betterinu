import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemePreference = "light" | "dark" | "system"

type AppState = {
  unreadNotificationCount: number
  themePreference: ThemePreference
}

type AppActions = {
  setUnreadNotificationCount: (count: number) => void
  decrementUnreadCount: () => void
  clearUnreadCount: () => void
  setThemePreference: (theme: ThemePreference) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      unreadNotificationCount: 0,
      themePreference: "system",

      setUnreadNotificationCount: (count) =>
        set({ unreadNotificationCount: count }),

      decrementUnreadCount: () =>
        set((state) => ({
          unreadNotificationCount: Math.max(
            0,
            state.unreadNotificationCount - 1
          ),
        })),

      clearUnreadCount: () => set({ unreadNotificationCount: 0 }),

      setThemePreference: (theme) => set({ themePreference: theme }),
    }),
    {
      name: "betterinu-app",
      /** Only persist themePreference — notification count is ephemeral */
      partialize: (state) => ({ themePreference: state.themePreference }),
    }
  )
)
