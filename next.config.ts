import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-bucket.deadlock-api.com',
      },
    ],
  },
};

export default nextConfig;
