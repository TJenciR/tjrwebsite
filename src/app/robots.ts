import type { MetadataRoute } from "next";

import {
  getCanonicalProductionOrigin,
  isIndexableDeployment,
} from "@/lib/site-origin";

export default function robots(): MetadataRoute.Robots {
  const isIndexable = isIndexableDeployment();

  return {
    rules: {
      userAgent: "*",
      ...(isIndexable ? { allow: "/" } : { disallow: "/" }),
    },
    host: getCanonicalProductionOrigin().origin,
  };
}
