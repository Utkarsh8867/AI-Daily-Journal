/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? '/api/:path*'  // Use Vercel serverless functions in production
          : 'http://localhost:8000/api/:path*',  // Use local backend in development
      },
    ]
  },
  // Optimize for Vercel deployment
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Handle static file serving
  trailingSlash: false,
  // Optimize images
  images: {
    domains: [],
    unoptimized: true
  }
}

module.exports = nextConfig