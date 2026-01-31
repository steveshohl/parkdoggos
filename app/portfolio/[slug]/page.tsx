import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  getGalleryBySlug,
  getMediaItemsByGallery,
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
  if (v.slug && typeof v.slug === 'object' && typeof v.slug.current === 'string') return v.slug.current
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const gallery = await getGalleryBySlug(slug)

  return {
    title: gallery?.title ? `${gallery.title} | ParkDoggos` : 'Gallery | ParkDoggos',
    description: gallery?.description || 'View this gallery',
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

  const [mediaItems, adjacent] = await Promise.all([
    getMediaItemsByGallery(gallery._id),
    getAdjacentGalleries(gallery.order ?? 0, gallery.title ?? ''),
  ])

  const prevSlug = adjacent?.prev?.slug?.current
  const nextSlug = adjacent?.next?.slug?.current

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
