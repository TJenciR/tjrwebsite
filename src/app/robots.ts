import type { MetadataRoute } from "next";

import {
  getCanonicalProductionOrigin,
  isIndexableDeployment,
} from "@/lib/site-origin";

interface RobotsEnvironment {
  readonly VERCEL_ENV?: string;
}

export function createRobotsPolicy(
  environment: RobotsEnvironment = { VERCEL_ENV: process.env.VERCEL_ENV },
): MetadataRoute.Robots {
  const isIndexable = isIndexableDeployment(environment);
  const canonicalOrigin = getCanonicalProductionOrigin().origin;

  return {
    rules: {
      userAgent: "*",
      ...(isIndexable ? { allow: "/" } : { disallow: "/" }),
    },
    host: canonicalOrigin,
    sitemap: `${canonicalOrigin}/sitemap.xml`,
  };
}

export default function robots(): MetadataRoute.Robots {
  return createRobotsPolicy();
}
