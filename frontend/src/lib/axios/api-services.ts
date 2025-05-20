import { ApiKeyResponse, ApiKeysResponse, AuthResponse, CreateApiKeyRequest, LoginRequest, RegisterRequest, User } from "../types/auth"
import { CreateSessionRequest, ExecuteCodeResponse, Session, SessionResponse } from "../types/session"
import { apiRequest, Params } from "./index"

// Authentication service
export const authService = {
  /**
   * User login
   */
  login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest.post("/api/v1/login/access-token", data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },

  /**
   * User registration
   */
  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest.post("/api/users/signup", data)
  },

  /**
   * Get current user information
   */
  getCurrentUser(): Promise<User> {
    return apiRequest.get("/api/v1/users/me")
  },

  /**
   * User logout
   */
  logout(): Promise<null> {
    return apiRequest.post("/api/v1/auth/logout")
  },

  /**
   * Refresh token
   */
  refreshToken(): Promise<{ token: string }> {
    return apiRequest.post("/api/v1/auth/refresh-token")
  },

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Promise<null> {
    return apiRequest.post("/api/v1/auth/request-password-reset", { email })
  },

  /**
   * Reset password
   */
  resetPassword(token: string, password: string): Promise<null> {
    return apiRequest.post("/api/v1/auth/reset-password", { token, password })
  },
}

// API key service
export const apiKeyService = {
  /**
   * Get all API keys for the user
   */
  getApiKeys(): Promise<ApiKeysResponse> {
    return apiRequest.get("/api/v1/api-keys")
  },

  /**
   * Create a new API key
   */
  createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyResponse> {
    return apiRequest.post("/api/v1/users/me/api-key")
  },

  /**
   * Get a single API key details
   */
  getApiKey(id: string): Promise<ApiKeyResponse> {
    return apiRequest.get(`/api/v1/api-keys/${id}`)
  },

  /**
   * Delete an API key
   */
  deleteApiKey(id: string): Promise<null> {
    return apiRequest.delete(`/api/v1/api-keys/${id}`)
  },

  /**
   * Update an API key
   */
  updateApiKey(
    id: string,
    data: { name?: string; status?: "active" | "revoked" },
  ): Promise<ApiKeyResponse> {
    return apiRequest.patch(`/api/v1/api-keys/${id}`, data)
  }
}

// Sandbox session service
export const sessionService = {
  /**
   * Create a new sandbox session
   */
  createSession(data: CreateSessionRequest): Promise<Session> {
    return apiRequest.post("/api/v1/sessions", data)
  },

  /**
   * Get session details
   */
  getSession(params: Params): Promise<SessionResponse> {
    return apiRequest.get("/api/v1/sessions", { params })
  },

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): Promise<null> {
    return apiRequest.delete(`/api/v1/sessions/${sessionId}`)
  },

  /**
   * Execute code
   */
  executeCode(sessionId: string, data: any): Promise<ExecuteCodeResponse> {
    return apiRequest.post(`/api/v1/sessions/${sessionId}/exec`, data)
  },

  /**
   * Install packages
   */
  installPackages(sessionId: string, data: any): Promise<any> {
    return apiRequest.post(`/api/v1/sessions/${sessionId}/packages`, data)
  },

  /**
   * Hibernate a session
   */
  hibernateSession(sessionId: string): Promise<SessionResponse> {
    return apiRequest.post(`/api/v1//sessions/${sessionId}/hibernate`)
  },

  /**
   * Restore a session
   */
  restoreSession(sessionId: string): Promise<SessionResponse> {
    return apiRequest.post(`/api/v1//sessions/${sessionId}/restore`)
  },

  /**
   * Get session list
   */
  getSessions(): Promise<ExecuteCodeResponse[]> {
    return apiRequest.get("/api/v1//sessions")
  },
}

// Export all API services
export const api = {
  auth: authService,
  apiKeys: apiKeyService,
  sessions: sessionService,
}
