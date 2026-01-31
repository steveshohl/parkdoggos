import Link from 'next/link'
import { Instagram } from 'lucide-react'

interface FooterProps {
  instagramUrl?: string
  siteTitle?: string
}

export function Footer({ instagramUrl, siteTitle }: FooterProps) {
  const currentYear = 2026 // Static to avoid hydration issues

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-page mx-auto px-page py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteTitle || 'ParkDoggos'}. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            {instagramUrl && (
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            )}
            <Link
              href="/portfolio"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
