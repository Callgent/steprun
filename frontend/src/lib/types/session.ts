import { Params } from "./global"

// SessionStore
export interface SessionStore {
  sessions: SessionResponse
  currentSession: Session | null
  executionResult: ExecuteCodeResponse | null
  isLoading: boolean
  error: string | null

  createSession: (runtime: string) => Promise<Session>
  getSession: (params?: Params) => Promise<SessionResponse>
  deleteSession: (id: string) => Promise<void>
  executeCode: (code: string) => Promise<ExecuteCodeResponse>
  setCurrentSession: (session: Session | null) => void
  clearError: () => void
}

export interface ExecuteCodeResponse {
  status?: string;
  stdout: string;
  stderr?: string;
}

// CreateSession
export interface CreateSessionRequest {
  runtime: string;
}

export type SessionResponse = Session[];
export interface Session {
  id?: string
  session_id: string
  created_at?: string
  expires_at?: string
  status?: SessionStatus
}

export enum SessionStatus {
  STARTED = "started",
  STOPPED = "stopped",
  HIBERNATED = "hibernated",
  DESTROYED = "destroyed",
}