export const galleriesQuery = `
*[_type == "gallery" && published == true] | order(order asc) {
  _id,
  title,
  description,
  type,
  "slug": slug.current,
  coverImage,
  order,
  featured
}
`

export const galleryBySlugQuery = `
*[_type == "gallery" && published == true && slug.current == $slug][0]{
  _id,
  title,
  description,
  type,
  "slug": slug.current,
  coverImage,
  order,
  featured,

  // ✅ NEW: if Gallery.items[] has been set (drag + drop), use it (order is preserved)
  // ✅ FALLBACK: if items[] is empty/not set yet, use the old query so the site still works
  "items": coalesce(
    items[]->{
      _id,
      title,
      caption,
      mediaType,
      image,
      videoUrl,
      videoPoster,
      order,
      featured
    },

    *[_type == "mediaItem" && published == true && gallery._ref == ^._id] | order(order asc) {
      _id,
      title,
      caption,
      mediaType,
      image,
      videoUrl,
      videoPoster,
      order,
      featured
    }
  )
}
`