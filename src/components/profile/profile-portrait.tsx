import Image from "next/image";

import { MediaPlaceholder } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import { isPublishedContent } from "@/lib/public-content";

interface ProfilePortraitProps {
  compact?: boolean;
}

export function ProfilePortrait({ compact = false }: ProfilePortraitProps) {
  const portrait = portfolioContent.mediaAssets.find(({ kind }) => kind === "portrait");
  const canRenderPortrait = Boolean(
    portrait &&
      isPublishedContent(portrait) &&
      portrait.publicPath &&
      portrait.alt &&
      portrait.width &&
      portrait.height,
  );

  return (
    <div
      className={compact ? "profile-portrait profile-portrait--compact" : "profile-portrait"}
      data-media-state={canRenderPortrait ? "available" : "missing"}
    >
      {canRenderPortrait && portrait?.publicPath && portrait.alt && portrait.width && portrait.height ? (
        <Image
          alt={portrait.alt}
          height={portrait.height}
          sizes={compact ? "160px" : "(max-width: 48rem) 70vw, 320px"}
          src={portrait.publicPath}
          width={portrait.width}
        />
      ) : (
        <MediaPlaceholder
          description="No approved standalone photograph is available."
          icon="user"
          label="Portrait awaiting approved source"
        />
      )}
    </div>
  );
}
