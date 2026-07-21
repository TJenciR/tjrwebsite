import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { getPublicValue } from "@/lib/content-value";
import { siteConfig } from "@/content/site-config";
import "@/styles/globals.css";

const name = getPublicValue(siteConfig.name) ?? "Portfolio";

export const metadata: Metadata = {
  title: {
    default: `${name} — migration foundation`,
    template: `%s — ${name}`,
  },
  description:
    "A privacy-safe migration foundation for the existing portfolio website.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          className="skip-link"
          href="#main-content"
        >
          Skip to main content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

