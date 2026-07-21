import type { Metadata } from "next";

import { ContentStatus } from "@/components/content-status";
import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Migration status for the portfolio's about and résumé content.",
  alternates: { canonical: "/about" },
};

const pendingFields = [
  ["Professional title", siteConfig.draftProfessionalTitle.status],
  ["Short biography", siteConfig.shortBiography.status],
  ["Long biography", siteConfig.longBiography.status],
  ["Location", siteConfig.location.status],
  ["Availability", siteConfig.currentAvailability.status],
] as const;

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Legacy route: /about"
      summary="The old PDF-first résumé is not copied into this foundation. A semantic, sanitized replacement will be added only after the content conflicts are resolved."
      title="About content pending verification"
    >
      <LegacyNotice path="/about" />
      <Card as="section" aria-labelledby="about-fields">
        <h2 className="foundation-card-heading" id="about-fields">
          Required content fields
        </h2>
        <dl className="foundation-definition-list">
          {pendingFields.map(([label, status]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <ContentStatus status={status} />
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </PageShell>
  );
}

