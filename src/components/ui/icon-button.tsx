import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type IconButtonVariant = "default" | "ghost" | "danger";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> {
  icon: IconName;
  label: string;
  variant?: IconButtonVariant;
}

export function IconButton({
  className,
  icon,
  label,
  type = "button",
  variant = "default",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn("ds-icon-button", `ds-icon-button--${variant}`, className)}
      title={label}
      type={type}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
