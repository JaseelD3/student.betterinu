import { create } from "zustand"

type DashboardStore = {
  /** The course currently selected in the "Today's Learning" section */
  activeCourseId: string | null
  setActiveCourseId: (id: string | null) => void

  /** Mobile accordion — which section card is expanded */
  expandedSection: string | null
  setExpandedSection: (id: string | null) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeCourseId: null,
  setActiveCourseId: (id) => set({ activeCourseId: id }),

  expandedSection: null,
  setExpandedSection: (id) =>
    set((state) => ({
      expandedSection: state.expandedSection === id ? null : id,
    })),
}))
