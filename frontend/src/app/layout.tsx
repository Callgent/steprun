import type { Metadata } from 'next'
import { Header } from '@/components/header'
import '@/components/styles/globals.css'

export const metadata: Metadata = {
  title: 'CoT for code - 𑢡teprun.ai'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-zinc-900 text-zinc-100 pixel-grid font-mono">
          <Header />
          <div className='max-w-7xl m-auto'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
