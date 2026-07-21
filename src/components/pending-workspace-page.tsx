import { PageShell } from "@/components/page-shell";
import { StatusNotice } from "@/components/ui";

interface PendingWorkspacePageProps {
  eyebrow: string;
  title: string;
  summary: string;
}

export function PendingWorkspacePage({
  eyebrow,
  title,
  summary,
}: PendingWorkspacePageProps) {
  return (
    <PageShell eyebrow={eyebrow} summary={summary} title={title}>
      <StatusNotice title="Content awaiting verification" variant="warning">
        This route is available in the workspace shell, but its final content will
        remain unpublished until the audited facts are confirmed.
      </StatusNotice>
    </PageShell>
  );
}
