import type { NextConfig } from "next"

/**
 * NEXT_PUBLIC_API_BASE_URL controls where the student frontend sends API calls.
 *
 * Local dev:
 *   Set NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 in .env.local
 *   (or leave it unset — the rewrite default will forward to localhost:3000)
 *
 * Production (deployed to Vercel):
 *   Set NEXT_PUBLIC_API_BASE_URL=https://your-lms-app.vercel.app
 *   in the betterinu-learn Vercel project environment variables.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000"

const nextConfig: NextConfig = {
  /**
   * Proxy all /api/** calls through to the LMS backend.
   * This keeps authentication (Bearer tokens) and CORS simple —
   * the browser always talks to the same origin as the frontend.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/api/:path*`,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "betterinu1.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        // Google favicons – used as link-section icons
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
    ],
  },
}

export default nextConfig
