'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type HeroImage = {
  url: string
  alt: string
  mobileUrl?: string
}

interface HeroCarouselProps {
  images: HeroImage[]
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    } else {
      media.addListener(update)
      return () => media.removeListener(update)
    }
  }, [query])

  return matches
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const safeImages = images ?? []

  // Tailwind sm breakpoint is 640px
  const isMobile = useMediaQuery('(max-width: 639px)')

  const goToNext = useCallback(() => {
    if (safeImages.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
  }, [safeImages.length])

  const goToPrev = useCallback(() => {
    if (safeImages.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }, [safeImages.length])

  useEffect(() => {
    if (safeImages.length <= 1) return
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [goToNext, safeImages.length])

  useEffect(() => {
    if (safeImages.length === 0) return
    setCurrentIndex((prev) => Math.min(prev, safeImages.length - 1))
  }, [safeImages.length])

  if (safeImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images</p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      {safeImages.map((image, index) => {
        const isActive = index === currentIndex

        // ✅ Desktop should ALWAYS use the horizontal image.url
        // ✅ Mobile can use mobileUrl if present
        const src = isMobile && image.mobileUrl ? image.mobileUrl : image.url

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* SINGLE IMAGE — show entire frame, no crop */}
            <Image
              src={src}
              alt={image.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-contain object-center"
            />
          </div>
        )
      })}

      {safeImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/60 hover:bg-background/90 rounded-full z-10"
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/60 hover:bg-background/90 rounded-full z-10"
            aria-label="Next image"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? 'bg-foreground' : 'bg-foreground/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}