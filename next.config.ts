import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  // better-auth proxy
  async rewrites() {
    return [
      {
        // Explicitly map v1 API requests
        source: "/api/v1/:path*",
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
