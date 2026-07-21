import type { Metadata } from "next";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { legacyQualifications } from "@/content/legacy-content";

export const metadata: Metadata = {
  title: "Documents",
  description: "Privacy-safe migration status for legacy qualification documents.",
};

export default function DocumentsPage() {
  return (
    <PageShell
      eyebrow="Legacy route: /documents"
      summary="Qualification labels are retained, but the public PDF files are not copied or redirected from this foundation while their privacy treatment is unresolved."
      title="Document access pending a privacy decision"
    >
      <LegacyNotice path="/documents" />
      <section aria-labelledby="qualification-labels" className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold" id="qualification-labels">
          Audited qualification labels
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {legacyQualifications.map((qualification) => (
            <li key={qualification}>{qualification}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

