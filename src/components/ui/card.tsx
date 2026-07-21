import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type CardVariant = "primary" | "elevated" | "interactive";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "div" | "section";
  padding?: "none" | "compact" | "default";
  variant?: CardVariant;
}

export function Card({
  as: Component = "div",
  className,
  padding = "default",
  variant = "elevated",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "ds-card",
        `ds-card--${variant}`,
        `ds-card--padding-${padding}`,
        className,
      )}
      {...props}
    />
  );
}
