import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s · ${SITE.title}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-text antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}