import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "10.2.0.2",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: "https",
        hostname: "suwaydapress-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
    minimumCacheTTL: 2678400, // 31 days
    formats: ['image/webp'],
  },
  allowedDevOrigins: ['10.2.0.2'],
};

export default nextConfig;