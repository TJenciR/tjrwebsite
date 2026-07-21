import { Portrait, type PublicMediaSource } from "@/components/media";
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

  const media: PublicMediaSource | null = canRenderPortrait && portrait?.publicPath &&
    portrait.alt && portrait.width && portrait.height
    ? {
        alt: portrait.alt,
        height: portrait.height,
        publicPath: portrait.publicPath,
        width: portrait.width,
      }
    : null;

  return (
    <Portrait
      className={compact ? "profile-portrait profile-portrait--compact" : "profile-portrait"}
      compact={compact}
      media={media}
    />
  );
}
