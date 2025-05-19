import type { ApiKey, User } from "./api"

export interface AuthState {
  user: User | null
  apiKeys: ApiKey[]
  isLoading: boolean
  error: string | null

  userInfo: () => Promise<boolean>
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean | string>
  addApiKey: (name: string) => Promise<ApiKey>
  deleteApiKey: (id: string) => Promise<void>
  clearError: () => void
}
