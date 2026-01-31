'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type LightboxItem = {
  id: string
  url: string
  alt: string
  caption?: string | null
}

export function LightboxGrid({
  items,
  aspectClassName = 'aspect-[3/5]',
}: {
  items: LightboxItem[]
  aspectClassName?: string
}) {
  const safeItems = useMemo(() => items?.filter(Boolean) ?? [], [items])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const isOpen = openIndex !== null
  const current = isOpen ? safeItems[openIndex] : null

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex((i) => (i! - 1 + safeItems.length) % safeItems.length)
  }, [openIndex, safeItems.length])
  const next = useCallback(() => {
    if (openIndex === null) return
    setOpenIndex((i) => (i! + 1) % safeItems.length)
  }, [openIndex, safeItems.length])

  // keyboard + escape
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    document.addEventListener('keydown', onKeyDown)
    // prevent background scroll while modal open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close, prev, next])

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {safeItems.map((item, idx) => (
          <figure key={item.id} className="overflow-hidden rounded bg-muted">
            <button
              type="button"
              onClick={() => setOpenIndex(idx)}
              className="relative w-full block focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Open image"
            >
              <div className={`relative w-full ${aspectClassName}`}>
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </button>

            {item.caption ? (
              <figcaption className="px-3 py-2 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && current ? (
        <div className="fixed inset-0 z-[999]">
          {/* backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={close}
            aria-label="Close"
          />

          {/* content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div className="relative w-full max-w-6xl">
              {/* close */}
              <button
                type="button"
                onClick={close}
                className="absolute right-2 top-2 md:right-4 md:top-4 z-10 p-2 rounded bg-black/40 hover:bg-black/60 text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* prev/next */}
              {safeItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded bg-black/40 hover:bg-black/60 text-white"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded bg-black/40 hover:bg-black/60 text-white"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* image */}
              <div className="relative w-full h-[70vh] md:h-[80vh] bg-black/20 rounded overflow-hidden">
                <Image
                  src={current.url}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* caption */}
              {current.caption ? (
                <div className="mt-3 text-center text-sm text-white/80">
                  {current.caption}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
