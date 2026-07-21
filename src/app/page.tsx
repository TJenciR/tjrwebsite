import { ContentStatus } from "@/components/content-status";
import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

export default function HomePage() {
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";

  return (
    <PageShell
      eyebrow="Migration foundation"
      summary="This server-rendered shell establishes routing, typed content boundaries, accessibility defaults, and Vercel-preview support without replacing the live Netlify site."
      title={name}
    >
      <LegacyNotice path="/" />
      <section aria-labelledby="foundation-status" className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold" id="foundation-status">
            Content status
          </h2>
          <ContentStatus status={siteConfig.lastContentVerificationDate.status} />
        </div>
        <p className="mt-3 leading-7 text-slate-700">
          Biographies, professional title, location, availability, and public
          profile URLs remain unpublished until Richard confirms them.
        </p>
      </section>
    </PageShell>
  );
}

