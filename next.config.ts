import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // In mock mode we serve bundled local assets; disabling optimizer avoids
    // intermittent /_next/image 504s on smaller production instances.
    unoptimized: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",
    // Allow explicit qualities used in the UI components.
    qualities: [65, 70, 75],
    // Serve modern formats (AVIF first, WebP fallback) for better compression
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints that match Tailwind's default screens
    // Keep an upper bound to avoid expensive 4K on-the-fly transforms
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 176, 222, 256, 320, 384],
    // Minimise layout shift: keep images in browser cache for 1 day
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Allow Firestore / Storage CDN (added when real backend is wired up)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  rewrites: async () => [
    {
      source: "/login",
      destination: "/auth/login",
    },
    {
      source: "/register",
      destination: "/auth/register",
    },
  ],
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
