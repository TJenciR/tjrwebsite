import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Now",
  description: "Current portfolio status pending content verification.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  return (
    <PendingWorkspacePage
      eyebrow="Workspace"
      summary="A reserved space for verified current work and availability."
      title="Now"
    />
  );
}
