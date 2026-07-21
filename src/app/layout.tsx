import type { Metadata } from "next";
import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/workspace";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";
import {
  getCanonicalProductionOrigin,
  getRuntimeOrigin,
  isIndexableDeployment,
} from "@/lib/site-origin";
import "@/styles/globals.css";

const name = getPublicValue(siteConfig.name) ?? "Portfolio";
const canonicalOrigin = getCanonicalProductionOrigin();
const runtimeOrigin = getRuntimeOrigin();
const isIndexable = isIndexableDeployment();

export const metadata: Metadata = {
  metadataBase: canonicalOrigin,
  title: {
    default: `${name} — personal workspace`,
    template: `%s — ${name}`,
  },
  description: "The personal portfolio workspace of Tököli Jenő-Richard.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: name,
    title: `${name} — personal workspace`,
    description: "The personal portfolio workspace of Tököli Jenő-Richard.",
    url: runtimeOrigin,
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
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <WorkspaceShell>{children}</WorkspaceShell>
      </body>
    </html>
  );
}
