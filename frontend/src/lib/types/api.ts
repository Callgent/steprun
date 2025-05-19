// 通用API响应类型
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// 用户相关类型
export interface User {
  id: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
  email: boolean;
}

// 认证相关请求类型
export interface LoginRequest {
  username: string;
  password: string;
  grant_type: string;
}

export interface RegisterRequest {
  username: string;
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

// 会话相关类型
export interface CreateSessionRequest {
  runtime: string;
}

export interface SessionResponse {
  session_id: string
}

export interface ExecuteCodeRequest {
  code: string;
}

export interface InstallPackagesRequest {
  packages: string[];
}

export interface InstallPackagesResponse {
  success: boolean;
  output?: string;
  error?: string;
}
