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
  "items": *[_type == "mediaItem" && published == true && gallery._ref == ^._id] | order(order asc) {
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
}
`
