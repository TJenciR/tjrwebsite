import type { ContentStatus as ContentStatusValue } from "@/types/content";
import { Badge, type BadgeVariant } from "@/components/ui";

const statusLabels: Record<ContentStatusValue, string> = {
  verified: "Verified",
  "needs-confirmation": "Needs confirmation",
  hidden: "Hidden",
};

const statusVariants: Record<ContentStatusValue, BadgeVariant> = {
  verified: "success",
  "needs-confirmation": "warning",
  hidden: "neutral",
};

interface ContentStatusProps {
  status: ContentStatusValue;
}

export function ContentStatus({ status }: ContentStatusProps) {
  return (
    <Badge data-content-status={status} variant={statusVariants[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

