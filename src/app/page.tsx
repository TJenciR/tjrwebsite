import type { Metadata } from "next";

import { ContentStatus } from "@/components/content-status";
import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";

  return (
    <PageShell
      eyebrow="Migration foundation"
      summary="This server-rendered shell establishes routing, typed content boundaries, accessibility defaults, and Vercel-preview support without replacing the live Netlify site."
      title={name}
    >
      <LegacyNotice path="/" />
      <Card as="section" aria-labelledby="foundation-status">
        <div className="foundation-heading-row">
          <h2 id="foundation-status">
            Content status
          </h2>
          <ContentStatus status={siteConfig.lastContentVerificationDate.status} />
        </div>
        <p className="foundation-supporting-copy">
          Biographies, professional title, location, availability, and public
          profile URLs remain unpublished until Richard confirms them.
        </p>
      </Card>
    </PageShell>
  );
}

