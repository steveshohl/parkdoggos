import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  getGalleryBySlug,
  getAdjacentGalleries,
  getAllGallerySlugs,
} from '@/lib/sanity/queries'
import { MediaGrid } from '@/components/gallery/media-grid'

export const dynamic = 'force-dynamic'

function toSlugString(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return null

  const v = value as any
  if (typeof v.current === 'string') return v.current
  if (typeof v.slug === 'string') return v.slug
  if (v.slug && typeof v.slug === 'object' && typeof v.slug.current === 'string')
    return v.slug.current
  return null
}

export async function generateStaticParams() {
  try {
    const raw = await getAllGallerySlugs()
    const slugs = (raw ?? [])
      .map(toSlugString)
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)

    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const gallery = await getGalleryBySlug(slug)

  if (!gallery?.title) {
    return {
      title: 'Gallery | ParkDoggos',
      description: 'View dog photography and video work by ParkDoggos.',
      alternates: { canonical: 'https://parkdoggos.com/portfolio' },
      openGraph: {
        type: 'website',
        url: 'https://parkdoggos.com/portfolio',
        title: 'Gallery | ParkDoggos',
        description: 'View dog photography and video work by ParkDoggos.',
        siteName: 'ParkDoggos',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Gallery | ParkDoggos',
        description: 'View dog photography and video work by ParkDoggos.',
      },
    }
  }

  const city = 'Brooklyn and NYC'
  const isVideo = gallery.type === 'video'
  const vibe = isVideo
    ? 'Cinematic dog video portraits'
    : 'Dramatic outdoor dog portraits using off-camera flash'

  const title = `${gallery.title} | ${city} | ParkDoggos`
  const description =
    (gallery.description && gallery.description.trim()) ||
    `${vibe} by ParkDoggos in ${city}.`

  const canonical = `https://parkdoggos.com/portfolio/${gallery.slug?.current ?? slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: 'ParkDoggos',
      // Optional (recommended): add /public/og.jpg (1200x630) and uncomment:
      // images: [{ url: 'https://parkdoggos.com/og.jpg', width: 1200, height: 630, alt: 'ParkDoggos' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // Optional: images: ['https://parkdoggos.com/og.jpg'],
    },
  }
}

export default async function GalleryDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  if (!slug) notFound()

  const gallery = await getGalleryBySlug(slug)
  if (!gallery) notFound()

  const adjacent = await getAdjacentGalleries(gallery.order ?? 0, gallery.title ?? '')

  const prevSlug = adjacent?.prev?.slug?.current
  const nextSlug = adjacent?.next?.slug?.current

  // ✅ IMPORTANT:
  // getGalleryBySlug now returns `items` in the correct order:
  // - manual drag order from Gallery.items[] if populated
  // - fallback query if not populated yet
  const mediaItems = Array.isArray((gallery as any)?.items) ? (gallery as any).items : []

  return (
    <div className="py-12 md:py-16 px-page">
      <div className="max-w-page mx-auto">
        {/* Back Link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="text-muted-foreground max-w-2xl text-lg">
              {gallery.description}
            </p>
          )}
        </div>

        {/* Media Grid (client component: grouping + lightbox) */}
        <MediaGrid items={mediaItems} galleryType={gallery.type} />

        {/* Prev/Next Navigation */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
          {prevSlug ? (
            <Link
              href={`/portfolio/${prevSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{adjacent?.prev?.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          {nextSlug ? (
            <Link
              href={`/portfolio/${nextSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">{adjacent?.next?.title}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}