# ParkDoggos Portfolio

A clean, editorial-style portfolio website for dramatic dog portrait photography. Built with Next.js 14, TypeScript, Tailwind CSS, and Sanity CMS.

![ParkDoggos Portfolio](https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop)

## ✨ Features

- **Light/White Editorial Design** - Clean, minimal aesthetic with CSS variables for easy theming
- **Sanity CMS** - Embedded content management studio at `/studio`
- **Portfolio Galleries** - Support for both stills and video content
- **Accessible Lightbox** - Keyboard-navigable image viewer
- **Video Modal** - YouTube/Vimeo/direct video support
- **Responsive Design** - Mobile-first, works on all devices
- **ISR (Incremental Static Regeneration)** - Fast page loads with fresh content
- **SEO Ready** - Open Graph and meta tags managed via Sanity

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity v3 (embedded studio)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📁 Project Structure

```
nextjs_space/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles + CSS variables
│   ├── portfolio/
│   │   ├── page.tsx          # Portfolio gallery listing
│   │   └── [slug]/page.tsx   # Individual gallery pages
│   ├── about/page.tsx        # About page
│   ├── contact/page.tsx      # Contact page
│   └── studio/[[...tool]]/   # Sanity Studio (embedded)
├── components/
│   ├── gallery/
│   │   ├── gallery-grid.tsx  # Gallery listing with filters
│   │   ├── media-grid.tsx    # Media items grid
│   │   ├── lightbox.tsx      # Image lightbox viewer
│   │   ├── video-modal.tsx   # Video player modal
│   │   └── hero-carousel.tsx # Homepage hero carousel
│   ├── layout/
│   │   ├── header.tsx        # Site header/nav
│   │   └── footer.tsx        # Site footer
│   └── ui/
│       └── contact-form.tsx  # Contact form (UI only)
├── lib/
│   ├── sanity/
│   │   ├── client.ts         # Sanity client + image URL builder
│   │   └── queries.ts        # GROQ queries
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
├── sanity/
│   ├── schemas/
│   │   ├── index.ts          # Schema exports
│   │   ├── site-settings.ts  # Site settings schema
│   │   ├── gallery.ts        # Gallery schema
│   │   └── media-item.ts     # Media item schema
│   └── lib/
│       └── desk-structure.ts # Custom desk structure
├── scripts/
│   └── seed-sanity.ts        # Content seeding script
├── sanity.config.ts          # Sanity configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── .env.local                # Environment variables (create this)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sanity.io account (free tier available)

### 1. Clone & Install

```bash
cd /home/ubuntu/parkdoggos_portfolio/nextjs_space
npm install
```

### 2. Set Up Sanity

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create new project"
3. Name it "ParkDoggos" (or your preferred name)
4. Select "Create dataset" → name it "production"
5. Copy your **Project ID** from the project settings

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Optional: For seeding script
SANITY_API_TOKEN=your-write-token
```

### 4. Configure CORS (Important!)

In your Sanity project dashboard:

1. Go to **API** → **CORS origins**
2. Add these origins:
   - `http://localhost:3000` (for development)
   - Your Vercel deployment URL (e.g., `https://your-site.vercel.app`)
3. Enable **Allow credentials**

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 6. Access Sanity Studio

Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

## 📝 Content Management

### Via Sanity Studio (`/studio`)

The embedded studio provides a user-friendly interface for managing:

- **Site Settings**: Site title, brand statement, hero images, featured galleries, about page content, contact info
- **Galleries**: Create photo/video galleries with cover images and descriptions
- **Media Items**: Add images or videos to galleries

### Seeding Placeholder Content (Optional)

If you want to quickly populate your site with demo content:

1. Create a write token in Sanity:
   - Go to **API** → **Tokens** → **Add API token**
   - Name: "Seed Script"
   - Permissions: **Editor**
   - Copy the token

2. Add to `.env.local`:
   ```env
   SANITY_API_TOKEN=your-write-token
   ```

3. Run the seed script:
   ```bash
   npx ts-node --esm scripts/seed-sanity.ts
   ```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`

4. Deploy!

5. **Important**: Update Sanity CORS to include your Vercel URL

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Theme Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --color-background: 255 255 255;    /* White background */
  --color-foreground: 23 23 23;       /* Near-black text */
  --color-muted: 245 245 245;         /* Light gray */
  --color-muted-foreground: 115 115 115;
  --color-border: 229 229 229;
  --color-accent: 38 38 38;           /* Dark accent */
  --color-accent-foreground: 255 255 255;
}
```

### Typography

The site uses Inter font by default. To change, update `app/layout.tsx`:

```tsx
import { Your_Font } from 'next/font/google'

const yourFont = Your_Font({
  subsets: ['latin'],
  variable: '--font-sans',
})
```

## 📋 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero carousel and featured galleries |
| `/portfolio` | All galleries with stills/video filter |
| `/portfolio/[slug]` | Individual gallery with media items |
| `/about` | About page |
| `/contact` | Contact page with form |
| `/studio` | Sanity Studio (embedded CMS) |

## 🔧 Troubleshooting

### Images Not Loading

1. Check that `cdn.sanity.io` is in `next.config.js` image domains
2. Verify your Sanity project ID is correct
3. Ensure CORS is configured for your origin

### Studio Not Loading

1. Clear browser cache and try again
2. Check browser console for CORS errors
3. Verify environment variables are set
4. Run `npm run build` to check for TypeScript errors

### Build Errors

1. Run `npm run lint` to check for issues
2. Ensure all environment variables are set
3. Check that Sanity project ID is valid

### "No Galleries Found"

1. Access `/studio` and add content
2. Make sure galleries have `published: true`
3. Check Sanity dashboard for data

## 📄 License

MIT License - feel free to use this template for your own projects!

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Sanity](https://sanity.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) (placeholder images)
