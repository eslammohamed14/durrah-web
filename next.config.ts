import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  rewrites
    : async () => [
        {
          source: '/login',
          destination: '/auth/login',
        },
      ],
};

export default nextConfig;
