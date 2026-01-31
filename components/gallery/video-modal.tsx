'use client'

import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'

interface VideoModalProps {
  url: string
  onClose: () => void
}

export function VideoModal({ url, onClose }: VideoModalProps) {
  // Parse video URL to get embed URL
  const embedUrl = useMemo(() => {
    if (!url) return null

    // YouTube
    const youtubeMatch = url?.match?.(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
    )
    if (youtubeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`
    }

    // Vimeo
    const vimeoMatch = url?.match?.(/vimeo\.com\/(?:video\/)?([\d]+)/)
    if (vimeoMatch?.[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    }

    // Direct video URL (mp4, webm, etc)
    if (url?.match?.(/\.(mp4|webm|ogg)$/i)) {
      return url
    }

    // Fallback: assume it's embeddable
    return url
  }, [url])

  const isDirectVideo = useMemo(() => {
    return embedUrl?.match?.(/\.(mp4|webm|ogg)$/i) ?? false
  }, [embedUrl])

  // Keyboard close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!embedUrl) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      {/* Backdrop click to close */}
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close video"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-accent-foreground hover:bg-accent-foreground/10 rounded-full transition-colors z-10"
        aria-label="Close video (Escape)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video container: 9:16 and bigger on desktop */}
      <div
        className="
          relative z-10 w-full
          max-w-[420px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-[720px]
        "
      >
        <div className="relative w-full aspect-[9/16] overflow-hidden rounded bg-black">
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video player"
            />
          )}
        </div>
      </div>
    </div>
  )
}
