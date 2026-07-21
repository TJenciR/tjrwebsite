import type { HTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type StatusNoticeVariant = "info" | "success" | "warning" | "danger";

const statusIcons: Record<StatusNoticeVariant, IconName> = {
  info: "info",
  success: "checkCircle",
  warning: "alert",
  danger: "danger",
};

export interface StatusNoticeProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  actions?: ReactNode;
  title: ReactNode;
  variant?: StatusNoticeVariant;
}

export function StatusNotice({
  actions,
  children,
  className,
  title,
  variant = "info",
  ...props
}: StatusNoticeProps) {
  return (
    <aside
      className={cn("ds-status-notice", `ds-status-notice--${variant}`, className)}
      role={variant === "danger" ? "alert" : "status"}
      {...props}
    >
      <span className="ds-status-notice__icon"><Icon name={statusIcons[variant]} /></span>
      <div className="ds-status-notice__content">
        <strong>{title}</strong>
        {children ? <div>{children}</div> : null}
        {actions ? <div className="ds-status-notice__actions">{actions}</div> : null}
      </div>
    </aside>
  );
}
