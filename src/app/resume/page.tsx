import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Sanitized résumé access is not yet available.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <PendingWorkspacePage
      eyebrow="Private by default"
      summary="No private document or direct contact detail is published from this route."
      title="Résumé"
    />
  );
}
