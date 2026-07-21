import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Hobbies",
  description: "Verified personal interests will be published here.",
  alternates: { canonical: "/hobbies" },
};

export default function HobbiesPage() {
  return (
    <PendingWorkspacePage
      eyebrow="Workspace"
      summary="A reserved space for verified interests outside software work."
      title="Hobbies"
    />
  );
}
