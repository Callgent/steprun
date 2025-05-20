export interface AuthStore {
  user: User | null
  apiKeys: ApiKey[]
  isLoading: boolean
  error: string | null

  userInfo: () => Promise<boolean>
  login: (username: string, password: string) => Promise<boolean>
  register: (full_name: string, email: string, password: string) => Promise<boolean | string>
  addApiKey: (name: string) => Promise<ApiKey>
  deleteApiKey: (id: string) => Promise<void>
  clearError: () => void
  recovery: (email: string) => Promise<boolean | string>
  resetPassword: (token: string, new_password: string) => Promise<boolean | string>
}

export interface User {
  id: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
  email: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface ApiKeyResponse {
  api_key: string;
}

export interface ApiKeysResponse {
  apiKeys: string[];
}

export interface ApiKey {
  name?: string;
  api_key: string;
}