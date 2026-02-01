import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getHome, getSiteSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/sanity.images'
import { HeroCarousel } from '@/components/gallery/hero-carousel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'ParkDoggos | Dramatic Outdoor Dog Photography in NYC',
  description:
    'ParkDoggos creates dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC using off-camera flash and editorial lighting techniques.',
  alternates: {
    canonical: 'https://parkdoggos.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://parkdoggos.com',
    title: 'ParkDoggos | Dramatic Outdoor Dog Photography in NYC',
    description:
      'Dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC — off-camera flash with an editorial feel.',
    siteName: 'ParkDoggos',
    // Optional (recommended): add /public/og.jpg (1200x630)
    // images: [{ url: 'https://parkdoggos.com/og.jpg', width: 1200, height: 630, alt: 'ParkDoggos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParkDoggos | Dramatic Outdoor Dog Photography in NYC',
    description:
      'Dramatic, outdoor, softbox-lit dog portraits in Brooklyn and NYC — off-camera flash with an editorial feel.',
    // Optional (recommended): add /public/og.jpg
    // images: ['https://parkdoggos.com/og.jpg'],
  },
}

function pickRandom<T>(arr: T[]): T | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)] ?? null
}

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()])

  const candidates = Array.isArray((home as any)?.heroImages)
    ? (home as any).heroImages
    : []
  const fallbackSingle = (home as any)?.heroImage ? [(home as any).heroImage] : []
  const heroPool = candidates.length > 0 ? candidates : fallbackSingle

  const chosenHero = pickRandom(heroPool)

  const heroImages = chosenHero
    ? [
        {
          url:
            urlFor(chosenHero)
              ?.width(2600)
              ?.fit('max')
              ?.auto('format')
              ?.url?.() || '',
          mobileUrl:
            urlFor(chosenHero)
              ?.width(1400)
              ?.height(2100)
              ?.fit('crop')
              ?.auto('format')
              ?.url?.() || '',
          alt: home?.title || 'Hero image',
        },
      ]
    : []

  const featuredGalleries = settings?.featuredGalleries ?? []

  return (
    <div>
      {/* ================= HERO HEADLINE (SHORTER OFF-WHITE PANEL) ================= */}
      <section className="pt-6 md:pt-8 pb-3 md:pb-4 px-page">
        <div className="max-w-page mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-2xl text-balance">
            Dramatic outdoor dog photography.
          </h1>

          {home?.heroCtaText && home?.heroCtaLink && (
            <div className="mt-4">
              <Link
                href={home.heroCtaLink}
                className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground font-medium rounded hover:opacity-90 transition-opacity"
              >
                {home.heroCtaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= HERO IMAGE ================= */}
      <section className="relative h-[78vh] md:h-[86vh] overflow-hidden">
        {heroImages.length > 0 && heroImages[0].url ? (
          <Link
            href="/portfolio"
            aria-label="View portfolio"
            className="absolute inset-0 block cursor-pointer group"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                <HeroCarousel images={heroImages} />
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </Link>
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">
              Add hero image(s) in Studio → <strong>Home</strong>
            </p>
          </div>
        )}
      </section>

      {/* ================= SEO / BRAND SENTENCE (BELOW IMAGE) ================= */}
      <section className="py-8 md:py-10 px-page">
        <div className="max-w-page mx-auto">
          <p className="max-w-2xl text-xl md:text-2xl leading-relaxed text-muted-foreground">
            ParkDoggos creates dramatic, outdoor, softbox-lit dog portraits in Brooklyn and
            NYC, using off-camera flash and editorial lighting techniques more
            common in fashion photography.
          </p>
        </div>
      </section>

      {/* ================= FEATURED GALLERIES ================= */}
      {featuredGalleries.length > 0 && (
        <section className="py-16 md:py-24 px-page">
          <div className="max-w-page mx-auto">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                Featured Work
              </h2>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredGalleries.slice(0, 6).map((gallery: any, idx: number) => {
                const coverUrl = gallery?.coverImage
                  ? urlFor(gallery.coverImage)
                      ?.width(1200)
                      ?.height(900)
                      ?.auto('format')
                      ?.url?.()
                  : null

                const href = gallery?.slug?.current
                  ? `/portfolio/${gallery.slug.current}`
                  : '/portfolio'
                const key = gallery?._id ?? `${gallery?.title ?? 'gallery'}-${idx}`

                return (
                  <Link
                    key={key}
                    href={href}
                    className="group relative aspect-[4/3] overflow-hidden bg-muted rounded"
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={gallery?.title || 'Gallery cover'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground px-4 text-center">
                          No cover image
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-lg font-medium text-accent-foreground">
                        {gallery?.title}
                      </h3>
                      {gallery?.type && (
                        <p className="text-sm text-accent-foreground/80 capitalize">
                          {gallery.type}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="py-16 md:py-24 px-page bg-muted/50">
        <div className="max-w-page mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6">
            Let&apos;s capture your companion&apos;s personality
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:opacity-90 transition-opacity"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}