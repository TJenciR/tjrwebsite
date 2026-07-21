import type { HTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "primary" | "cyan" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: IconName;
  variant?: BadgeVariant;
}

export function Badge({ children, className, icon, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span className={cn("ds-badge", `ds-badge--${variant}`, className)} {...props}>
      {icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
    </span>
  );
}
