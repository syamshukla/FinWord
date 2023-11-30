import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Container } from '@/components/layout/container'
import { Toaster } from 'sonner'
import Footer from '@/components/layout/footer'
import { GeistSans } from 'geist/font/sans'
import dynamic from 'next/dynamic'
const MainNav = dynamic(() => import('@/components/layout/main-nav'), {
  ssr: false,
})
export const metadata: Metadata = {
  title: 'BULL-ISH',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
