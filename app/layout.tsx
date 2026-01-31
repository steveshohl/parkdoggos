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

export const metadata: Metadata = {
  title: 'ParkDoggos',
  description: 'Dramatic dog portrait photography',
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