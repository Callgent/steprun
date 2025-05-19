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
      const { session_id } = await api.sessions.createSession({ runtime })

      if (session_id) {
        set((state) => ({
          sessions: [...state.sessions, { session_id }],
          currentSession: { session_id },
          isLoading: false,
        }))

        return { session_id }
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

      if (response.data && response.data.session_id) {
        const session = response.data.session_id
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
      const updatedSessions = get().sessions.filter((s) => s.session_id !== id)
      const currentSession = get().currentSession

      set({
        sessions: updatedSessions,
        currentSession: currentSession && currentSession.session_id === id ? null : currentSession,
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
      const { result, stderr } = await api.sessions.executeCode(currentSession.session_id, { code })

      if (result) {
        const executionResult = { result: result, stderr: stderr || "" }
        set({ executionResult: executionResult, isLoading: false })
        return executionResult;
      }

      throw new Error("Failed to execute code")
    } catch (error) {
      const errorResult: ExecuteCodeResponse = {
        status: "error",
        result: 'error',
        stderr: error instanceof Error ? error.message : "An error occurred",
      }

      set({
        error: 'error',
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
      await api.sessions.installPackages(currentSession.session_id, { packages })
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
