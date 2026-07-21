import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconName;
  iconPosition?: "start" | "end";
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  icon,
  iconPosition = "start",
  size = "medium",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const iconNode = icon ? <Icon name={icon} /> : null;

  return (
    <button
      className={cn(
        "ds-button",
        `ds-button--${variant}`,
        `ds-button--${size}`,
        className,
      )}
      type={type}
      {...props}
    >
      {iconPosition === "start" ? iconNode : null}
      <span>{children}</span>
      {iconPosition === "end" ? iconNode : null}
    </button>
  );
}
