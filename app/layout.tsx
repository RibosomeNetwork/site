import React from "react"
import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-space-mono',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ribosome.network'),
  title: {
    default: '$RIBO — Bounded-Composition Useful Proof-of-Work',
    template: '%s · $RIBO',
  },
  description: 'RIBO is an instantiation of Bounded-Composition Useful Proof-of-Work (BC-UPoW). Security from sequential time. Useful work earns a bounded discount. Built around multi-state RNA inverse design, VDFs, and zkVM execution proofs.',
  keywords: ['RIBO', 'BC-UPoW', 'Bounded Composition', 'VDF', 'zkVM', 'RNA folding', 'cryptocurrency', 'DeSci', 'useful proof of work', 'ribosome network'],
  authors: [{ name: 'Ribosome Network' }],
  openGraph: {
    title: '$RIBO — Bounded-Composition Useful Proof-of-Work',
    description: 'Security from sequential time. Useful work earns a bounded discount. The ceiling holds even with a perfect biological oracle.',
    type: 'website',
    url: 'https://ribosome.network',
    siteName: 'Ribosome Network',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$RIBO — BC-UPoW',
    description: 'Security from sequential time. Useful work earns a bounded discount.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
