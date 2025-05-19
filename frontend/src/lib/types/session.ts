export interface Session {
  session_id: string;
}

export interface ExecuteCodeResponse {
  status?: string;
  result: string;
  stderr?: string;
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
