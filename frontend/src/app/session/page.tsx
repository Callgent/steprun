import { SessionDemo } from "@/components/session/demo"

export default function DemoPage() {
  return (
    <div className="font-mono p-4 ">
      <div className="container mx-auto py-8 ">
        <h1 className="text-3xl  mb-8 text-center">Interactive Code Execution</h1>
        <div className="max-w-4xl mx-auto ">
          <SessionDemo />
        </div>
      </div>
    </div>
  )
}
