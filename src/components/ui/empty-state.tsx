import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: IconName;
  title: ReactNode;
}

export function EmptyState({ action, className, description, icon = "inbox", title }: EmptyStateProps) {
  return (
    <div className={cn("ds-empty-state", className)}>
      <span className="ds-empty-state__icon"><Icon name={icon} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="ds-empty-state__action">{action}</div> : null}
    </div>
  );
}
