import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SiteSettings {
  title?: string
  brandStatement?: string
  contactEmail?: string
  instagramUrl?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
  }
  homeHero?: SanityImage[]
  featuredGalleries?: Gallery[]
  aboutTitle?: string
  aboutContent?: PortableTextBlock[]
  aboutPortrait?: SanityImage
  contactIntro?: string
}

export interface Gallery {
  _id: string
  title?: string
  slug?: { current: string }
  description?: string
  type?: 'stills' | 'video'
  coverImage?: SanityImage
  order?: number
  featured?: boolean
}

export interface MediaItem {
  _id: string
  title?: string
  caption?: string
  mediaType?: 'image' | 'video'
  image?: SanityImage
  videoUrl?: string
  videoPoster?: SanityImage
  order?: number
  featured?: boolean
}
