import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Skills",
  description: "Verified portfolio skills will be published here.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <PendingWorkspacePage
      eyebrow="Workspace"
      summary="A reserved space for the verified technology and language inventory."
      title="Skills"
    />
  );
}
