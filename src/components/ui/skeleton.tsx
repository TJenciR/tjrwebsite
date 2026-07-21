import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  shape?: "line" | "block" | "circle";
}

export function Skeleton({ className, label = "Loading", shape = "line", ...props }: SkeletonProps) {
  return (
    <div
      aria-label={label}
      aria-busy="true"
      className={cn("ds-skeleton", `ds-skeleton--${shape}`, className)}
      data-motion="respects-user-preference"
      role="status"
      {...props}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
    </div>
  );
}
