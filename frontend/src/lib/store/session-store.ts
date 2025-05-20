import { create } from "zustand"
import { api } from "@/lib/axios/api-services"
import type { ExecuteCodeResponse, SessionStore } from "@/lib/types/session"

// Create session state store
export const useSessionStore = create<SessionStore>((set, get) => ({
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
  getSession: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await api.sessions.getSession(params || {})
      if (sessions.length > 0) {
        set({ isLoading: false, sessions })
        return sessions
      }
      return []
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
      const { stdout, stderr } = await api.sessions.executeCode(currentSession.session_id, { code })

      if (stdout || stderr) {
        const executionResult = { stdout: stdout, stderr: stderr || "" }
        set({ executionResult: executionResult, isLoading: false })
        return executionResult;
      }

      throw new Error("Failed to execute code")
    } catch (error) {
      const errorResult: ExecuteCodeResponse = {
        status: "error",
        stdout: '',
        stderr: error instanceof Error ? error.message : "An error occurred",
      }
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        executionResult: errorResult,
        isLoading: false,
      })
      return errorResult
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
