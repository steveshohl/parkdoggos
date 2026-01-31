/**
 * Sanity Seed Script for ParkDoggos Portfolio
 * 
 * This script seeds your Sanity dataset with placeholder content.
 * 
 * Prerequisites:
 * 1. Create a Sanity project at https://www.sanity.io/manage
 * 2. Add a write token with Editor permissions
 * 3. Set environment variables in .env.local:
 *    - NEXT_PUBLIC_SANITY_PROJECT_ID
 *    - NEXT_PUBLIC_SANITY_DATASET
 *    - SANITY_API_TOKEN (write token)
 * 
 * Usage:
 *   npx ts-node --esm scripts/seed-sanity.ts
 *   or
 *   npm run seed
 */

import { createClient } from '@sanity/client'

// Load environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(`
❌ Missing required environment variables!

Please ensure you have set:
  NEXT_PUBLIC_SANITY_PROJECT_ID
  SANITY_API_TOKEN (with Editor permissions)

You can get these from: https://www.sanity.io/manage
`)
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Placeholder image URLs (using Unsplash for demo purposes)
const placeholderImages = {
  hero1: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&h=1080&fit=crop',
  hero2: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1920&h=1080&fit=crop',
  hero3: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1920&h=1080&fit=crop',
  goldenHour: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&h=600&fit=crop',
  actionPlay: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=600&fit=crop',
  studioPortraits: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=600&fit=crop',
  behindScenes: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
  aboutPortrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
}

// Sample media images
const mediaImages = [
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&h=600&fit=crop',
]

async function uploadImageFromUrl(imageUrl: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${imageUrl}`)
      return null
    }
    
    const buffer = await response.arrayBuffer()
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename,
    })
    
    return asset._id
  } catch (error) {
    console.warn(`Failed to upload image ${filename}:`, error)
    return null
  }
}

async function seed() {
  console.log('🌱 Starting seed process...\n')

  try {
    // Step 1: Upload images
    console.log('📸 Uploading placeholder images...')
    
    const heroImageIds: string[] = []
    for (let i = 1; i <= 3; i++) {
      const id = await uploadImageFromUrl(
        placeholderImages[`hero${i}` as keyof typeof placeholderImages],
        `hero-${i}.jpg`
      )
      if (id) heroImageIds.push(id)
    }
    
    const goldenHourCoverId = await uploadImageFromUrl(placeholderImages.goldenHour, 'golden-hour-cover.jpg')
    const actionPlayCoverId = await uploadImageFromUrl(placeholderImages.actionPlay, 'action-play-cover.jpg')
    const studioPortraitsCoverId = await uploadImageFromUrl(placeholderImages.studioPortraits, 'studio-portraits-cover.jpg')
    const behindScenesCoverId = await uploadImageFromUrl(placeholderImages.behindScenes, 'behind-scenes-cover.jpg')
    const aboutPortraitId = await uploadImageFromUrl(placeholderImages.aboutPortrait, 'about-portrait.jpg')

    console.log('✅ Images uploaded\n')

    // Step 2: Create galleries
    console.log('📁 Creating galleries...')
    
    const galleries = [
      {
        _id: 'gallery-golden-hour',
        _type: 'gallery',
        title: 'Golden Hour Sessions',
        slug: { _type: 'slug', current: 'golden-hour-sessions' },
        description: 'Capturing the magical light of sunset with our four-legged friends.',
        type: 'stills',
        coverImage: goldenHourCoverId ? { _type: 'image', asset: { _type: 'reference', _ref: goldenHourCoverId } } : undefined,
        order: 1,
        featured: true,
        published: true,
      },
      {
        _id: 'gallery-action-play',
        _type: 'gallery',
        title: 'Action & Play',
        slug: { _type: 'slug', current: 'action-play' },
        description: 'Dynamic moments of joy, energy, and pure doggo happiness.',
        type: 'video',
        coverImage: actionPlayCoverId ? { _type: 'image', asset: { _type: 'reference', _ref: actionPlayCoverId } } : undefined,
        order: 2,
        featured: true,
        published: true,
      },
      {
        _id: 'gallery-studio-portraits',
        _type: 'gallery',
        title: 'Studio Portraits',
        slug: { _type: 'slug', current: 'studio-portraits' },
        description: 'Professional studio portraits that showcase each dog\'s unique personality.',
        type: 'stills',
        coverImage: studioPortraitsCoverId ? { _type: 'image', asset: { _type: 'reference', _ref: studioPortraitsCoverId } } : undefined,
        order: 3,
        featured: false,
        published: true,
      },
      {
        _id: 'gallery-behind-scenes',
        _type: 'gallery',
        title: 'Behind the Scenes',
        slug: { _type: 'slug', current: 'behind-the-scenes' },
        description: 'A peek into the fun and chaos of our photo sessions.',
        type: 'video',
        coverImage: behindScenesCoverId ? { _type: 'image', asset: { _type: 'reference', _ref: behindScenesCoverId } } : undefined,
        order: 4,
        featured: false,
        published: true,
      },
    ]

    for (const gallery of galleries) {
      if (gallery.coverImage) {
        await client.createOrReplace(gallery)
        console.log(`  ✓ Created gallery: ${gallery.title}`)
      }
    }
    console.log('✅ Galleries created\n')

    // Step 3: Create media items
    console.log('🖼️ Creating media items...')
    
    let mediaItemCount = 0
    for (const gallery of galleries) {
      const itemsForGallery = gallery.type === 'stills' ? 4 : 2
      
      for (let i = 0; i < itemsForGallery; i++) {
        const imageIndex = mediaItemCount % mediaImages.length
        const imageId = await uploadImageFromUrl(
          mediaImages[imageIndex],
          `media-${gallery._id}-${i}.jpg`
        )
        
        if (imageId) {
          const mediaItem = {
            _id: `media-${gallery._id}-${i}`,
            _type: 'mediaItem',
            title: `${gallery.title} - Image ${i + 1}`,
            caption: `A beautiful moment from our ${gallery.title.toLowerCase()} collection.`,
            mediaType: gallery.type === 'stills' ? 'image' : 'video',
            image: gallery.type === 'stills' 
              ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } }
              : undefined,
            videoPoster: gallery.type === 'video'
              ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } }
              : undefined,
            videoUrl: gallery.type === 'video' 
              ? 'https://www.youtube.com/watch?v=SqcY0GlETPk'
              : undefined,
            order: i,
            featured: i === 0,
            published: true,
            gallery: { _type: 'reference', _ref: gallery._id },
          }
          
          await client.createOrReplace(mediaItem)
          mediaItemCount++
        }
      }
      console.log(`  ✓ Created ${itemsForGallery} media items for: ${gallery.title}`)
    }
    console.log('✅ Media items created\n')

    // Step 4: Create site settings
    console.log('⚙️ Creating site settings...')
    
    const siteSettings = {
      _id: 'siteSettings',
      _type: 'siteSettings',
      title: 'ParkDoggos',
      brandStatement: 'Dramatic dog portrait photography that captures the soul and spirit of your beloved companion.',
      contactEmail: 'hello@parkdoggos.com',
      instagramUrl: 'https://instagram.com/parkdoggos',
      seo: {
        metaTitle: 'ParkDoggos | Dramatic Dog Portrait Photography',
        metaDescription: 'Professional dog portrait photography capturing the unique personality and beauty of your four-legged friends.',
      },
      homeHero: heroImageIds.map(id => ({
        _type: 'image',
        asset: { _type: 'reference', _ref: id },
      })),
      featuredGalleries: [
        { _type: 'reference', _ref: 'gallery-golden-hour' },
        { _type: 'reference', _ref: 'gallery-action-play' },
      ],
      aboutTitle: 'About ParkDoggos',
      aboutContent: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Welcome to ParkDoggos, where we believe every dog has a story worth telling through dramatic, artistic photography.',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Our passion is capturing the unique personality, spirit, and beauty of your four-legged family members. Whether it\'s the soulful gaze of a senior dog or the boundless energy of a playful puppy, we strive to create timeless images that you\'ll treasure forever.',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Based in the heart of the city, we work both in our professional studio and on location in parks, beaches, and your favorite outdoor spots. Every session is tailored to bring out the best in your companion.',
            },
          ],
        },
      ],
      aboutPortrait: aboutPortraitId 
        ? { _type: 'image', asset: { _type: 'reference', _ref: aboutPortraitId } }
        : undefined,
      contactIntro: 'Ready to capture your dog\'s unique personality? We\'d love to hear from you! Fill out the form below or reach out directly.',
    }

    await client.createOrReplace(siteSettings)
    console.log('✅ Site settings created\n')

    console.log(`
🎉 Seeding complete!

Created:
  • 1 Site Settings document
  • ${galleries.length} Galleries (${galleries.filter(g => g.featured).length} featured)
  • ${mediaItemCount} Media Items
  • ${heroImageIds.length} Hero images

Next steps:
  1. Start the dev server: npm run dev
  2. Visit http://localhost:3000 to see your portfolio
  3. Visit http://localhost:3000/studio to manage content
`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
