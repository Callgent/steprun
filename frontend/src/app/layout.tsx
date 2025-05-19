import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" />
      </head>
      <body>
        <div className="min-h-screen bg-zinc-900 text-zinc-100 font-ps2 pixel-grid text-sm">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
