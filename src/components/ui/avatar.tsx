import Image from "next/image";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type AvatarSize = "small" | "medium" | "large";

const avatarPixels: Record<AvatarSize, number> = {
  small: 32,
  medium: 40,
  large: 64,
};

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  initials: string;
  size?: AvatarSize;
  src?: string;
}

export function Avatar({
  alt = "",
  className,
  initials,
  size = "medium",
  src,
  ...props
}: AvatarProps) {
  const pixels = avatarPixels[size];

  return (
    <span className={cn("ds-avatar", `ds-avatar--${size}`, className)} {...props}>
      {src ? (
        <Image alt={alt} height={pixels} src={src} width={pixels} />
      ) : (
        <span aria-hidden="true">{initials.slice(0, 2).toUpperCase()}</span>
      )}
      {!src && alt ? <span className="ds-visually-hidden">{alt}</span> : null}
    </span>
  );
}
