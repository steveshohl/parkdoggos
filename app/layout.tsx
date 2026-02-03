import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getSiteSettings } from '@/lib/sanity/queries'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const SITE_URL = 'https://parkdoggos.com'
const OG_IMAGE = `${SITE_URL}/og.jpg`

export const metadata: Metadata = {
  // Baseline defaults (page-level metadata can override these)
  title: {
    default: 'ParkDoggos',
    template: '%s | ParkDoggos',
  },
  description:
    'Dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC using off-camera flash and editorial lighting techniques.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'ParkDoggos',
    description:
      'Dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC using off-camera flash and editorial lighting techniques.',
    siteName: 'ParkDoggos',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ParkDoggos – Dramatic Outdoor Dog Portraits in NYC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParkDoggos',
    description:
      'Dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC — off-camera flash with an editorial feel.',
    images: [OG_IMAGE],
  },
}

const GA_ID = 'G-HD76K77ST3'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Abacus script (unchanged) */}
        <script async src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>

      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* ✅ Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <Header siteTitle={settings?.title} />
        <main className="flex-1">{children}</main>
        <Footer
          instagramUrl={settings?.instagramUrl}
          siteTitle={settings?.title}
        />
      </body>
    </html>
  )
}