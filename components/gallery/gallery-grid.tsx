import Image from 'next/image'
import Link from 'next/link'
import { getAllGalleries } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/sanity.images'

export const dynamic = 'force-dynamic'

type GalleryGridProps = {
  galleries: any[]
  columns?: {
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  aspectClassName?: string
  /** If true, show title/description as an overlay in the upper-left */
  overlayCaption?: boolean
}

function GalleryGrid({
  galleries,
  columns = { base: 1, sm: 2, lg: 3 },
  aspectClassName = 'aspect-[3/4]',
  overlayCaption = true,
}: GalleryGridProps) {
  // NOTE: Tailwind may not include dynamic class names like `grid-cols-${n}` in production builds.
  // If you ever see columns not applying in prod, swap this for a hardcoded map (I can provide).
  const cols = [
    columns.base ? `grid-cols-${columns.base}` : null,
    columns.sm ? `sm:grid-cols-${columns.sm}` : null,
    columns.md ? `md:grid-cols-${columns.md}` : null,
    columns.lg ? `lg:grid-cols-${columns.lg}` : null,
    columns.xl ? `xl:grid-cols-${columns.xl}` : null,
    columns['2xl'] ? `2xl:grid-cols-${columns['2xl']}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`grid ${cols} gap-6 md:gap-8`}>
      {galleries.map((gallery: any, idx: number) => {
        const href = gallery?.slug?.current
          ? `/portfolio/${gallery.slug.current}`
          : '/portfolio'

        const coverUrl = gallery?.coverImage
          ? urlFor(gallery.coverImage)?.width(2400)?.quality(85)?.url?.()
          : null

        const key = gallery?._id ?? `${gallery?.title ?? 'gallery'}-${idx}`

        return (
          <Link
            key={key}
            href={href}
            className="group overflow-hidden rounded bg-muted"
          >
            {/* IMAGE */}
            <div className={`relative ${aspectClassName} overflow-hidden`}>
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={gallery?.title || 'Gallery cover'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx < 2}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  No cover image
                </div>
              )}

              {overlayCaption ? (
                <>
                  {/* subtle top gradient for legibility */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/60 to-transparent" />

                  {/* CAPTION OVERLAY (forced upper-left) */}
                  <div className="absolute inset-0 z-20 p-3">
                    <div className="flex items-start justify-start">
                      <div className="max-w-[90%]">
                        <div className="inline-flex items-center rounded px-2.5 py-1.5 text-sm font-medium text-white bg-black/40 backdrop-blur">
                          {gallery?.title ?? 'Untitled'}
                        </div>

                        {gallery?.description ? (
                          <div className="mt-1 max-w-[22rem] text-xs text-white/80 line-clamp-2">
                            {gallery.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function PortfolioPage() {
  const [stills, videos] = await Promise.all([
    getAllGalleries('stills'),
    getAllGalleries('video'),
  ])

  const hasAny = (stills?.length ?? 0) + (videos?.length ?? 0) > 0

  return (
    <div className="py-12 md:py-16 px-page">
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            Portfolio
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Select a gallery to view stills and video work.
          </p>
        </div>

        {!hasAny ? (
          <div className="rounded bg-muted/30 p-6 text-sm text-muted-foreground">
            No galleries found. Add some in Sanity Studio → <strong>Galleries</strong>.
          </div>
        ) : (
          <div className="space-y-16">
            {/* STILLS — 3 cols on desktop */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  Stills
                </h2>
                <span className="text-sm text-muted-foreground">
                  {stills.length} gallery{stills.length === 1 ? '' : 'ies'}
                </span>
              </div>

              {stills.length ? (
                <GalleryGrid
                  galleries={stills}
                  columns={{ base: 1, sm: 2, lg: 3 }}
                  aspectClassName="aspect-[4/5]"
                  overlayCaption
                />
              ) : (
                <div className="rounded bg-muted/30 p-6 text-sm text-muted-foreground">
                  No stills galleries yet.
                </div>
              )}
            </section>

            {/* VIDEO — 2 cols on desktop */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  Video
                </h2>
                <span className="text-sm text-muted-foreground">
                  {videos.length} gallery{videos.length === 1 ? '' : 'ies'}
                </span>
              </div>

              {videos.length ? (
                <GalleryGrid
                  galleries={videos}
                  columns={{ base: 1, sm: 2, lg: 2 }}
                  aspectClassName="aspect-video"
                  overlayCaption
                />
              ) : (
                <div className="rounded bg-muted/30 p-6 text-sm text-muted-foreground">
                  No video galleries yet.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}