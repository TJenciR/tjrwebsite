import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Education",
  description: "Verified education details will be published here.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <PendingWorkspacePage
      eyebrow="Workspace"
      summary="A reserved space for audited education and qualification facts."
      title="Education"
    />
  );
}
