import type { ContentStatus as ContentStatusValue } from "@/types/content";

const statusLabels: Record<ContentStatusValue, string> = {
  verified: "Verified",
  "needs-confirmation": "Needs confirmation",
  hidden: "Hidden",
};

interface ContentStatusProps {
  status: ContentStatusValue;
}

export function ContentStatus({ status }: ContentStatusProps) {
  return (
    <span
      className="inline-flex rounded-full border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
      data-content-status={status}
    >
      {statusLabels[status]}
    </span>
  );
}

