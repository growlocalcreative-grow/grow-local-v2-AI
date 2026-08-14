import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Static export-friendly image handling
    unoptimized: true,
  },
};

export default nextConfig;
