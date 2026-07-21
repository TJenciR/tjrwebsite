import type { NextConfig } from "next";

import { configuredRedirects } from "./src/config/redirects";
import { getSecurityHeaders } from "./src/config/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        headers: getSecurityHeaders(),
        source: "/:path*",
      },
    ];
  },
  async redirects() {
    return configuredRedirects;
  },
};

export default nextConfig;

