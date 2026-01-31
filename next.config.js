/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Let Vercel/Next handle distDir and output automatically.
  // Remove `images.unoptimized` so Next can optimize images on Vercel.
}

module.exports = nextConfig