'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { urlFor } from '@/lib/sanity/sanity.images'
import type { MediaItem } from '@/lib/types'
import { Lightbox } from './lightbox'
import { VideoModal } from './video-modal'

interface MediaGridProps {
  items: MediaItem[]
  galleryType?: 'stills' | 'video'
}

type Group = {
  name: string
  items: MediaItem[]
}

function safeText(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function getGroupName(item: any): string {
  // Group by title first, otherwise caption
  const name = safeText(item?.title) || safeText(item?.caption)
  return name || 'Other'
}

function buildImageUrl(source: any, w: number, h?: number): string | null {
  try {
    if (!source) return null
    const b = urlFor(source)
    if (!b?.width || !b?.url) return null
    const sized = typeof h === 'number' ? b.width(w).height(h) : b.width(w)
    return sized?.url?.() ?? null
  } catch {
    return null
  }
}

export function MediaGrid({ items, galleryType }: MediaGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const safeItems = items ?? []

  // Flat list used by the Lightbox (source of truth for indexing)
  const imageItems = useMemo(
    () => safeItems.filter((it) => it?.mediaType === 'image' && it?.image),
    [safeItems]
  )

  // Build a stable map: Sanity _id -> index in imageItems
  const imageIndexById = useMemo(() => {
    const map = new Map<string, number>()
    imageItems.forEach((it: any, idx: number) => {
      if (typeof it?._id === 'string' && it._id) map.set(it._id, idx)
    })
    return map
  }, [imageItems])

  // Decide whether to group:
  // - For video galleries: NO grouping, so items can form columns
  // - For stills: keep grouping behavior
  const groups: Group[] = useMemo(() => {
    const hasAnyVideo = safeItems.some((it) => it?.mediaType === 'video')
    const isVideoGallery = galleryType === 'video' || hasAnyVideo

    if (isVideoGallery) {
      return [{ name: '', items: safeItems }]
    }

    const out: Group[] = []
    for (const item of safeItems) {
      const name = getGroupName(item)
      let g = out.find((x) => x.name === name)
      if (!g) {
        g = { name, items: [] }
        out.push(g)
      }
      g.items.push(item)
    }
    return out
  }, [safeItems, galleryType])

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const openVideo = useCallback((url: string) => setVideoUrl(url), [])
  const closeVideo = useCallback(() => setVideoUrl(null), [])

  if (safeItems.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded">
        <p className="text-muted-foreground">No media items yet. Add some in the Studio.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-14">
        {groups.map((group) => (
          <section key={group.name || 'all'}>
            {/* Only show group header when there IS a group name */}
            {group.name && (
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">{group.name}</h2>
                <span className="text-sm text-muted-foreground">
                  {group.items.length} item{group.items.length === 1 ? '' : 's'}
                </span>
              </div>
            )}

            {/* ✅ 1 col mobile, 2 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {group.items.map((item: any, idx: number) => {
                const isVideo = item?.mediaType === 'video'

                const thumbUrl = isVideo
                  ? buildImageUrl(item?.videoPoster, 1600)
                  : buildImageUrl(item?.image, 1600)

                const imageIndex =
                  !isVideo && typeof item?._id === 'string'
                    ? imageIndexById.get(item._id) ?? -1
                    : -1

                const key = item?._id ?? item?._key ?? `${group.name || 'all'}-${idx}`

                const title = safeText(item?.title)
                const caption = safeText(item?.caption)

                // Avoid duplicates:
                // - don’t show caption if it’s the same as the title
                // - don’t show caption if it’s the same as the group header (when grouping is used)
                const showCaptionBelow =
                  !!caption && caption !== title && (!group.name || caption !== group.name)

                const overlayText = title || (caption && (!group.name || caption !== group.name) ? caption : '')

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (isVideo && item?.videoUrl) return openVideo(item.videoUrl)
                      if (!isVideo && imageIndex >= 0) return openLightbox(imageIndex)
                    }}
                    className="group text-left"
                  >
                    <div className="relative overflow-hidden rounded bg-muted">
                      <div className="relative aspect-[3/4.5]">
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={title || caption || 'Media item'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground px-4 text-center">
                              {isVideo ? 'Video' : 'Image'} preview unavailable
                            </p>
                          </div>
                        )}

                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 ml-1" />
                            </div>
                          </div>
                        )}

                        {overlayText && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-sm text-accent-foreground line-clamp-2">{overlayText}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      {title && (
                        <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">
                          {title}
                        </p>
                      )}
                      {showCaptionBelow && (
                        <p className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-2">
                          {caption}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={imageItems.map((item: any) => ({
            url: buildImageUrl(item?.image, 2400) ?? '',
            alt: safeText(item?.title) || safeText(item?.caption) || 'Image',
            caption: safeText(item?.caption) || undefined,
          }))}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}

      {videoUrl && <VideoModal url={videoUrl} onClose={closeVideo} />}
    </>
  )
}