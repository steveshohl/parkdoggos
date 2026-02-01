import Image from 'next/image'
import Link from 'next/link'
import { getAllGalleries } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/sanity.images'

export const dynamic = 'force-dynamic'

type GalleryGridProps = {
  galleries: any[]
  aspectClassName?: string
}

function GalleryGrid({
  galleries,
  aspectClassName = 'aspect-[3/4]',
}: GalleryGridProps) {
  return (
    // ✅ 1-up inside each column so each card is BIG
    <div className="grid grid-cols-1 gap-8">
      {galleries.map((gallery: any, idx: number) => {
        const href = gallery?.slug?.current
          ? `/portfolio/${gallery.slug.current}`
          : '/portfolio'

        const coverUrl = gallery?.coverImage
          ? urlFor(gallery.coverImage)?.width(2400)?.quality(85)?.url?.()
          : null

        const key = gallery?._id ?? `${gallery?.title ?? 'gallery'}-${idx}`

        // ✅ Prefer caption if that’s what you’re filling out in Studio
        const label =
          gallery?.caption ??
          gallery?.coverImage?.caption ??
          gallery?.title ??
          'Untitled'

        const subLabel =
          gallery?.description ??
          gallery?.coverImage?.description ??
          null

        return (
          <Link key={key} href={href} className="group">
            <div className="overflow-hidden rounded bg-white">
              {/* IMAGE */}
              <div className={`relative ${aspectClassName} overflow-hidden`}>
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={String(label)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={idx < 2}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    No cover image
                  </div>
                )}
              </div>

              {/* ✅ EDITORIAL CAPTION BELOW IMAGE (lower-left under image) */}
              <div className="border-t border-border/60 px-3 py-2">
                <div className="text-base font-medium tracking-tight">
                  {label}
                </div>
                {subLabel ? (
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {subLabel}
                  </div>
                ) : null}
              </div>
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
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
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
            No galleries found. Add some in Sanity Studio →{' '}
            <strong>Galleries</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* STILLS */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  Stills
                </h2>
              </div>

              {stills.length ? (
                <GalleryGrid galleries={stills} aspectClassName="aspect-[3/4]" />
              ) : (
                <div className="rounded bg-muted/30 p-6 text-sm text-muted-foreground">
                  No stills galleries yet.
                </div>
              )}
            </section>

            {/* VIDEO */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  Video
                </h2>
              </div>

              {videos.length ? (
                <GalleryGrid galleries={videos} aspectClassName="aspect-[3/4]" />
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