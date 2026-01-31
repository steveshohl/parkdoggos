import imageUrlBuilder from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import { client } from './client'

const builder: ImageUrlBuilder = imageUrlBuilder(client)

/**
 * Convert a Sanity image field into a usable URL builder chain.
 * Usage:
 *   urlFor(image).width(1200).height(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Convenience helper: returns a string URL (or empty string) for a Sanity image.
 * Usage:
 *   sanityImageUrl(image, { width: 1200 })
 */
export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  opts?: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpg' | 'png' | 'webp'
  }
): string {
  if (!source) return ''

  let chain = urlFor(source)

  if (opts?.width) chain = chain.width(opts.width)
  if (opts?.height) chain = chain.height(opts.height)
  if (opts?.quality) chain = chain.quality(opts.quality)
  if (opts?.format) chain = chain.format(opts.format)

  return chain.url()
}
