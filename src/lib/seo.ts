import type { Metadata } from "next";

import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";
import { getCanonicalProductionOrigin } from "@/lib/site-origin";

export const siteName = getPublicValue(siteConfig.name) ?? "Tököli Jenő-Richard";
export const defaultSiteDescription =
  "Verified projects, skills, education, and current work by Tököli Jenő-Richard.";

export function getCanonicalUrl(path = "/"): string {
  return new URL(path, getCanonicalProductionOrigin()).toString();
}

interface PageMetadataInput {
  description: string;
  path: `/${string}` | "/";
  title: string;
}

export function createPageMetadata({
  description,
  path,
  title,
}: PageMetadataInput): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const socialTitle = `${title} — ${siteName}`;
  const socialImage = {
    alt: `${siteName} personal workspace portfolio`,
    height: 630,
    url: getCanonicalUrl("/opengraph-image"),
    width: 1200,
  };

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      description,
      images: [socialImage],
      siteName,
      title: socialTitle,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [socialImage.url],
      title: socialTitle,
    },
  };
}
