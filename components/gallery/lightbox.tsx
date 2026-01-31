'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  images: { url: string; alt: string; caption?: string }[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const safeImages = images ?? []
  const safeIndex = Math.max(0, Math.min(currentIndex ?? 0, safeImages.length - 1))
  const currentImage = safeImages[safeIndex]

  const goToPrev = useCallback(() => {
    if (safeImages.length === 0) return
    const newIndex = (safeIndex - 1 + safeImages.length) % safeImages.length
    onNavigate?.(newIndex)
  }, [safeIndex, safeImages.length, onNavigate])

  const goToNext = useCallback(() => {
    if (safeImages.length === 0) return
    const newIndex = (safeIndex + 1) % safeImages.length
    onNavigate?.(newIndex)
  }, [safeIndex, safeImages.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goToPrev, goToNext])

  if (!currentImage) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-accent-foreground hover:bg-accent-foreground/10 rounded-full transition-colors z-10"
        aria-label="Close lightbox (Escape)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-accent-foreground hover:bg-accent-foreground/10 rounded-full transition-colors z-10"
            aria-label="Previous image (Left arrow)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-accent-foreground hover:bg-accent-foreground/10 rounded-full transition-colors z-10"
            aria-label="Next image (Right arrow)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={currentImage?.url ?? ''}
            alt={currentImage?.alt ?? 'Lightbox image'}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Caption and counter */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-accent-foreground">
          {currentImage?.caption && (
            <p className="text-sm mb-2">{currentImage.caption}</p>
          )}
          <p className="text-xs opacity-60">
            {safeIndex + 1} / {safeImages.length}
          </p>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  )
}
