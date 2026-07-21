import type { Metadata } from "next";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui";
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
      <Card as="section" aria-labelledby="qualification-labels">
        <h2 className="foundation-card-heading" id="qualification-labels">
          Audited qualification labels
        </h2>
        <ul className="foundation-bullet-list">
          {legacyQualifications.map((qualification) => (
            <li key={qualification}>{qualification}</li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}

