import Link from "next/link"
import { Code, Terminal, Server, Github, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelStar, PixelCursor, PixelRobot, PixelCode } from "@/components/pixel-decorations"

export default function Home() {
  return (
    <div>
      <section className="container mx-auto py-24 px-4 relative">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl md:text-5xl xl:text-6xl leading-tight special-title font-pixelRounded">
            <div>Run a Step then Generate</div>
            <div className="text-emerald-500 text-2xl mt-4">CoT for code</div>
          </h1>
          <p className="max-w-md md:max-w-xl xl:max-w-3xl mx-auto text-zinc-400 pixel-text font-ps2 ">
            Steprun.ai is a Secure REPL Sandbox Runtime Environment for Agentic & AI use cases
          </p>
          <div className="pt-6">
            <Link href="/profile">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 pixel-button">
                <span className="font-sans pixel-text text-base">Get API Key</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12 px-4 ">
        <h2 className="font-bold text-center mb-12 pixel-text text-3xl">Core API Endpoints</h2>
        <div className="max-w-4xl mx-auto bg-zinc-950 border-4 border-zinc-800 overflow-hidden pixel-container">
          <div className="bg-zinc-800 px-4 py-2 flex items-center gap-2">
            <Code className="h-4 w-4 text-emerald-500 pixel-icon" />
            <span className="pixel-text">API Reference</span>
          </div>
          <div className="px-6 py-4 space-y-6 ">
            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1  pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text">Create a new sandbox session</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500/20 text-red-500 px-2 py-1  pixel-text">DELETE</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text ">Destroy an existing session</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1  pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/exec</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text ">Execute code in the sandbox environment</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1  pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/packages</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text ">Install packages in the sandbox environment</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1  pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/hibernate</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text ">Hibernate a session to save resources</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1  pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/restore</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text ">Restore a previously hibernated session</p>
            </div>
          </div>
        </div>
      </section>


      <section id="features" className="container mx-auto py-24 px-4 ">
        <h2 className="text-3xl text-center mb-16 pixel-text">Core Advantages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-base mb-4 pixel-text">Escape if-else hell</h3>
            <p className="text-zinc-400 pixel-text ">
              Focus on the current execution path only, skipping exponential branching complexity.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-base mb-4 pixel-text">Debug line by line</h3>
            <p className="text-zinc-400 pixel-text ">
              Catch and fix errors instantly–line by line, no post-hoc tracing.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-base mb-4 pixel-text">Declare now, implement later</h3>
            <p className="text-zinc-400 pixel-text ">
              Define function stubs first, fill logic only when called (like human iterative coding).
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Server className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-base mb-4 pixel-text">Hibernate & restore</h3>
            <p className="text-zinc-400 pixel-text ">
              Persist sessions mid-execution, ideal for long-running processes and iterative workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto py-24 px-4 bg-zinc-950/50 ">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 pixel-text">API in Action</h2>
          <div className="bg-zinc-900 border-4 border-zinc-800 overflow-hidden pixel-container">
            <div className="border-b-4 border-zinc-800 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-500 pixel-icon" />
                <span className="font-medium pixel-text ">API Request Examples</span>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-red-500"></div>
                <div className="h-4 w-4 bg-yellow-500"></div>
                <div className="h-4 w-4 bg-green-500"></div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">1. Create a Session</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800  md: overflow-x-auto text-sm">
                  {`// Request
POST /api/v1/sessions
Content-Type: application/json

{
  "runtime": "python3.9"
}

// Response
{
  "session_id": "sess_abc123xyz",
  "status": "ready",
  "runtime": "python3.9",
  "created_at": "2023-05-15T15:30:45Z"
}`}
                </pre>
              </div>

              {/* Execute Code */}
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">2. Execute Code</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800  md: overflow-x-auto text-sm">
                  {`// Request
POST /api/v1/sessions/sess_abc123xyz/exec
Content-Type: application/json

{
  "code": "def find_primes(n):\\n    if n < 2:\\n        return []\\n    return [x for x in range(2, n+1) if all(x % y != 0 for y in range(2, int(x**0.5) + 1))]\\n\\nprint(find_primes(20))"
}

// Response
{
  "status": "success",
  "output": "[2, 3, 5, 7, 11, 13, 17, 19]",
  "execution_time": 0.0045
}`}
                </pre>
              </div>

              {/* Install Package */}
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">3. Install Package</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800  md:overflow-x-auto text-sm">
                  {`// Request
POST /api/v1/sessions/sess_abc123xyz/packages
Content-Type: application/json

{
  "packages": ["numpy", "pandas==1.4.2"]
}

// Response
{
  "status": "success",
  "installed": [
    {"name": "numpy", "version": "1.23.5"},
    {"name": "pandas", "version": "1.4.2"}
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto py-24 px-4 text-base">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold pixel-text">Perfect for AI Platforms & Tools</h2>
          <p className="text-lg text-zinc-400 pixel-text font-pixelRounded">
            Our sandbox runtime provides the execution environment that AI platforms need
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8 font-pixelRounded">
            <div className="bg-zinc-800/50 p-6 border-4 border-zinc-700 pixel-container">
              <h3 className=" font-bold mb-4 pixel-text text-xl">For AI Platforms</h3>
              <p className="text-zinc-400 mb-4 pixel-text ">
                Integrate our sandbox API to safely execute code generated by your AI models
              </p>
              <ul className="text-left space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Secure execution of AI-generated code</span>
                </li>
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Step-by-step validation and debugging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Isolated environments for each user</span>
                </li>
              </ul>
            </div>
            <div className="bg-zinc-800/50 p-6 border-4 border-zinc-700 pixel-container">
              <h3 className=" font-bold mb-4 pixel-text text-xl">For Developers</h3>
              <p className="text-zinc-400 mb-4 pixel-text ">
                Build interactive coding tutorials or educational platforms
              </p>
              <ul className="text-left space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Interactive code examples in documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Educational platforms with live code execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text ">Collaborative coding environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold pixel-text">Ready to Power Your Applications?</h2>
          <p className=" text-zinc-400 pixel-text">Get started with our sandbox runtime API today</p>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 pixel-button">
                <span className="pixel-text">Get API Access</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-6 pixel-button"
            >
              <span className="pixel-text">View API Docs</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-zinc-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-500 pixel-icon" />
              <span className="font-bold pixel-text">𑢡teprun.ai</span>
            </div>
            <div className="text-zinc-500  pixel-text">
              © {new Date().getFullYear()} 𑢡teprun.ai. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-zinc-400 hover:text-emerald-500">
                <Github className="h-5 w-5 pixel-icon" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 pixel-text">
                Terms
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 pixel-text">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
