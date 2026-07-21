import type { Metadata } from "next";

import { ContentStatus } from "@/components/content-status";
import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Migration status for the portfolio's about and résumé content.",
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
      <section aria-labelledby="about-fields" className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold" id="about-fields">
          Required content fields
        </h2>
        <dl className="mt-4 divide-y divide-slate-200">
          {pendingFields.map(([label, status]) => (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3" key={label}>
              <dt className="font-medium">{label}</dt>
              <dd>
                <ContentStatus status={status} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShell>
  );
}

