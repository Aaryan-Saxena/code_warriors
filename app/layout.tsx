import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitQuest',
  description: 'Created with love',
  generator: 'Code.warriors',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
