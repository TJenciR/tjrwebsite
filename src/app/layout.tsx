import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo";
import { WorkspaceShell } from "@/components/workspace";
import {
  getCanonicalProductionOrigin,
  isIndexableDeployment,
} from "@/lib/site-origin";
import { defaultSiteDescription, getCanonicalUrl, siteName } from "@/lib/seo";
import { createSiteStructuredData } from "@/lib/structured-data";
import "@/styles/globals.css";

const canonicalOrigin = getCanonicalProductionOrigin();
const isIndexable = isIndexableDeployment();

export const metadata: Metadata = {
  metadataBase: canonicalOrigin,
  title: {
    default: `${siteName} — personal workspace`,
    template: `%s — ${siteName}`,
  },
  applicationName: `${siteName} — personal workspace`,
  authors: [{ name: siteName, url: getCanonicalUrl() }],
  creator: siteName,
  description: defaultSiteDescription,
  formatDetection: { address: false, email: false, telephone: false },
  referrer: "strict-origin-when-cross-origin",
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — personal workspace`,
    description: defaultSiteDescription,
    url: getCanonicalUrl(),
    images: [
      {
        alt: `${siteName} personal workspace portfolio`,
        height: 630,
        url: getCanonicalUrl("/opengraph-image"),
        width: 1200,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description: defaultSiteDescription,
    images: [getCanonicalUrl("/opengraph-image")],
    title: `${siteName} — personal workspace`,
  },
  robots: {
    index: isIndexable,
    follow: isIndexable,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={createSiteStructuredData()} id="site-structured-data" />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <WorkspaceShell>{children}</WorkspaceShell>
      </body>
    </html>
  );
}
