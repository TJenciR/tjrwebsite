import type { HTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface MediaPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  description?: ReactNode;
  icon?: IconName;
  label: ReactNode;
}

export function MediaPlaceholder({
  className,
  description,
  icon = "image",
  label,
  ...props
}: MediaPlaceholderProps) {
  return (
    <div className={cn("ds-media-placeholder", className)} {...props}>
      <Icon name={icon} />
      <strong>{label}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  );
}
