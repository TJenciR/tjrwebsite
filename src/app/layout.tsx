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
          className="absolute left-4 top-4 z-50 -translate-y-24 bg-white px-3 py-2 text-sm shadow focus:translate-y-0"
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

