import type { Metadata } from "next"
import { Space_Grotesk, Space_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ribo/theme-provider"
import { RiboLogoAnimations } from "@/components/ribo/ribo-logo"

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
  description:
    'RIBO is an instantiation of Bounded-Composition Useful Proof-of-Work (BC-UPoW). Security from sequential time. Useful work earns a bounded discount. Built around multi-state RNA inverse design, VDFs, and zkVM execution proofs. Currently in research & development.',
  keywords: [
    'RIBO',
    'BC-UPoW',
    'Bounded Composition',
    'VDF',
    'zkVM',
    'RNA folding',
    'cryptocurrency',
    'DeSci',
    'useful proof of work',
    'ribosome network',
  ],
  authors: [{ name: 'Ribosome Network' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
    shortcut: ['/icon-light-32x32.svg'],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: '$RIBO — Bounded-Composition Useful Proof-of-Work',
    description:
      'Security from sequential time. Useful work earns a bounded discount. The ceiling holds even with a perfect biological oracle. In active development.',
    type: 'website',
    url: 'https://ribosome.network',
    siteName: 'Ribosome Network',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'RIBO — Bounded-Composition Useful Proof-of-Work logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '$RIBO — BC-UPoW',
    description:
      'Security from sequential time. Useful work earns a bounded discount. In development.',
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
          <RiboLogoAnimations />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
