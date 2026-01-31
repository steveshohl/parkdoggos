# ParkDoggos Portfolio 🐾

A clean, editorial-style portfolio website for dramatic dog portrait photography.  
Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Sanity CMS**.

---

## ✨ Features

- Editorial, light magazine-style design
- Embedded Sanity Studio at `/studio`
- Stills + video portfolio galleries
- Hero image carousel
- Accessible image lightbox
- Video modal (YouTube / Vimeo / direct)
- Fully responsive, mobile-first layout
- SEO-ready routing and metadata

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity v3
- **Icons:** Lucide React
- **Animation:** Framer Motion

---

## 📁 Project Structure

```
nextjs_space/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── portfolio/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── studio/[[...tool]]/
├── components/
│   ├── gallery/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── sanity/
│   ├── types.ts
│   └── utils.ts
├── sanity/
│   ├── deskStructure.ts
│   ├── home.ts
│   └── schemaTypes.ts
├── scripts/
│   └── seed-sanity.ts
├── sanity.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm
- Sanity.io account (free tier is fine)

### Install dependencies
```bash
npm install
```

### Environment variables
Create `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Run locally
```bash
npm run dev
```

- Site: http://localhost:3000  
- Studio: http://localhost:3000/studio  

---

## 🌐 Deployment

Deploy easily with **Vercel**:
1. Import the GitHub repo
2. Add environment variables
3. Deploy
4. Add your Vercel URL to Sanity CORS

---

## 📄 License

MIT