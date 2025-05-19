export interface Session {
  id: string
  runtime: string
  status: "creating" | "ready" | "error" | "hibernated"
  createdAt: string
  expiresAt?: string
}

export interface ExecuteCodeResponse {
  status: "success" | "error"
  output: string
  executionTime: number
  error?: string
}

export interface SessionState {
  sessions: Session[]
  currentSession: Session | null
  executionResult: ExecuteCodeResponse | null
  isLoading: boolean
  error: string | null

  createSession: (runtime: string) => Promise<Session>
  getSession: (id: string) => Promise<Session>
  deleteSession: (id: string) => Promise<void>
  executeCode: (code: string) => Promise<ExecuteCodeResponse>
  installPackages: (packages: string[]) => Promise<void>
  setCurrentSession: (session: Session | null) => void
  clearError: () => void
}
