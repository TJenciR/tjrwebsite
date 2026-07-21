import type { NextConfig } from "next";

import {
  legacyAliases,
  legacyDownloadRedirects,
} from "./src/content/legacy-routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...legacyAliases.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
      ...legacyDownloadRedirects.map(({ source, destination }) => ({
        source,
        destination,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;

