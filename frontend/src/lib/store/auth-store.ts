import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "@/lib/axios/api-services"
import type { AuthStore } from "@/lib/types/auth"

// Create authentication state store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      apiKeys: [],
      isLoading: false,
      error: null,

      userInfo: async () => {
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          const user = await api.auth.getCurrentUser();
          set({ user })
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An error occurred"
          set({ error: errorMessage })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Real API call using axios
          const { access_token } = await api.auth.login({
            username: email, password, grant_type: 'password',
          });
          if (access_token) {
            localStorage.setItem('auth_token', access_token);
            return true;
          }
          set({ error: "Invalid credentials" });
          return false;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "An error occurred" });
          return false;
        } finally {
          set({ isLoading: false })
        }
      },

      // Register
      register: async (full_name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          await api.auth.register({ full_name, email, password })
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An error occurred"
          set({ error: errorMessage })
          return errorMessage
        } finally {
          set({ isLoading: false })
        }
      },

      // requestPasswordReset
      recovery: async (email) => {
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          const { message } = await api.auth.requestPasswordReset(email);
          if (message) {
            return true
          }
          return false
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An error occurred"
          set({ error: errorMessage, })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      // resetPassword
      resetPassword: async (token, new_password) => {
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          const { message } = await api.auth.resetPassword(token, new_password)
          if (message) {
            return true
          }
          return false
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An error occurred"
          set({ error: errorMessage })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      // Add API key
      addApiKey: async (name) => {
        const { user } = get()
        if (!user) {
          throw new Error("User not authenticated")
        }
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          const { api_key } = await api.apiKeys.createApiKey({ name })
          if (api_key) {
            // Update state
            const updatedApiKeys = [...get().apiKeys, { api_key }]
            set({ apiKeys: updatedApiKeys })
            return { api_key }
          }
          throw new Error("Failed to create API key")
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "An error occurred", })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Delete API key
      deleteApiKey: async (delKey) => {
        const { user } = get()
        if (!user) {
          throw new Error("User not authenticated")
        }
        set({ isLoading: true, error: null })
        try {
          // Real API call using axios
          await api.apiKeys.deleteApiKey(delKey)
          // Update state
          const updatedApiKeys = get().apiKeys.filter((key) => key.api_key !== delKey)
          set({ apiKeys: updatedApiKeys })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "An error occurred" })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage", // Local storage name
      partialize: (state) => ({ user: state.user, apiKeys: state.apiKeys }), // Only persist these fields
    },
  ),
)
