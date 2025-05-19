import { create } from "zustand"
import { api } from "@/lib/axios/api-services"
import type { ExecuteCodeResponse, SessionState } from "@/lib/types/session"

// Create session state store
export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  executionResult: null,
  isLoading: false,
  error: null,

  // Create session
  createSession: async (runtime) => {
    set({ isLoading: true, error: null })

    try {
      // Real API call using axios
      const response = await api.sessions.createSession({ runtime })

      if (response.data && response.data.session) {
        const newSession = response.data.session

        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
          isLoading: false,
        }))

        return newSession
      }

      throw new Error("Failed to create session")
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      })

      throw error
    }
  },

  // Get session
  getSession: async (id) => {
    set({ isLoading: true, error: null })

    try {
      // Real API call using axios
      const response = await api.sessions.getSession(id)

      if (response.data && response.data.session) {
        const session = response.data.session
        set({ isLoading: false })
        return session
      }

      throw new Error("Session not found")
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      })

      throw error
    }
  },

  // Delete session
  deleteSession: async (id) => {
    set({ isLoading: true, error: null })

    try {
      // Real API call using axios
      await api.sessions.deleteSession(id)

      // Update state
      const updatedSessions = get().sessions.filter((s) => s.id !== id)
      const currentSession = get().currentSession

      set({
        sessions: updatedSessions,
        currentSession: currentSession && currentSession.id === id ? null : currentSession,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      })

      throw error
    }
  },

  // Execute code
  executeCode: async (code) => {
    const { currentSession } = get()

    if (!currentSession) {
      throw new Error("No active session")
    }

    set({ isLoading: true, error: null, executionResult: null })

    try {
      // Real API call using axios
      const response = await api.sessions.executeCode(currentSession.id, { code })

      if (response.data) {
        const result = response.data
        set({ executionResult: result, isLoading: false })
        return result
      }

      throw new Error("Failed to execute code")
    } catch (error) {
      const errorResult: ExecuteCodeResponse = {
        status: "error",
        output: "",
        executionTime: 0,
        error: error instanceof Error ? error.message : "An error occurred",
      }

      set({
        error: errorResult.error,
        executionResult: errorResult,
        isLoading: false,
      })

      return errorResult
    }
  },

  // Install packages
  installPackages: async (packages) => {
    const { currentSession } = get()

    if (!currentSession) {
      throw new Error("No active session")
    }

    set({ isLoading: true, error: null })

    try {
      // Real API call using axios
      await api.sessions.installPackages(currentSession.id, { packages })
      set({ isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      })

      throw error
    }
  },

  // Set current session
  setCurrentSession: (session) => {
    set({ currentSession: session })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },
}))
