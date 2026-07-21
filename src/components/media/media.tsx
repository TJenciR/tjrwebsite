import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { MediaPlaceholder } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface PublicMediaSource {
  readonly alt: string;
  readonly height: number;
  readonly publicPath: string;
  readonly width: number;
}

type MediaKind =
  | "architecture"
  | "gallery"
  | "hobby"
  | "portrait"
  | "project-cover"
  | "qualification";

interface MediaFrameProps {
  className?: string;
  decorative?: boolean;
  eager?: boolean;
  fallbackAspectRatio: string;
  fallbackDescription: ReactNode;
  fallbackLabel: ReactNode;
  kind: MediaKind;
  media: PublicMediaSource | null;
  objectFit?: "contain" | "cover";
  sizes: string;
}

function isSafePublicMedia(media: PublicMediaSource | null, decorative: boolean) {
  return Boolean(
    media &&
      media.publicPath.startsWith("/") &&
      !media.publicPath.startsWith("//") &&
      media.width > 0 &&
      media.height > 0 &&
      (decorative || media.alt.trim().length > 0),
  );
}

function MediaFrame({
  className,
  decorative = false,
  eager = false,
  fallbackAspectRatio,
  fallbackDescription,
  fallbackLabel,
  kind,
  media,
  objectFit = "cover",
  sizes,
}: MediaFrameProps) {
  const canRender = isSafePublicMedia(media, decorative);
  const aspectRatio = canRender && media
    ? `${media.width} / ${media.height}`
    : fallbackAspectRatio;
  const style = { "--media-aspect-ratio": aspectRatio } as CSSProperties;

  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn("media-frame", `media-frame--${kind}`, className)}
      data-media-kind={kind}
      data-media-state={canRender ? "available" : "missing"}
      style={style}
    >
      {canRender && media ? (
        <Image
          alt={decorative ? "" : media.alt}
          className="media-frame__image"
          height={media.height}
          loading={eager ? undefined : "lazy"}
          preload={eager}
          sizes={sizes}
          src={media.publicPath}
          style={{ objectFit }}
          width={media.width}
        />
      ) : (
        <MediaPlaceholder
          className="media-frame__placeholder"
          description={fallbackDescription}
          icon={kind === "portrait" ? "user" : "image"}
          label={fallbackLabel}
        />
      )}
    </div>
  );
}

interface PortraitProps {
  className?: string;
  compact?: boolean;
  media: PublicMediaSource | null;
}

export function Portrait({ className, compact = false, media }: PortraitProps) {
  return (
    <MediaFrame
      className={className}
      eager
      fallbackAspectRatio="4 / 5"
      fallbackDescription="No approved standalone photograph is available."
      fallbackLabel="Portrait awaiting approved source"
      kind="portrait"
      media={media}
      sizes={compact ? "160px" : "(max-width: 48rem) 70vw, 320px"}
    />
  );
}

interface ProjectCoverProps {
  className?: string;
  eager?: boolean;
  media: PublicMediaSource | null;
  projectTitle: string;
}

export function ProjectCover({ className, eager, media, projectTitle }: ProjectCoverProps) {
  return (
    <MediaFrame
      className={className}
      eager={eager}
      fallbackAspectRatio="16 / 10"
      fallbackDescription="No verified project image is available yet."
      fallbackLabel={`${projectTitle} media`}
      kind="project-cover"
      media={media}
      sizes="(max-width: 48rem) 100vw, (max-width: 75rem) 50vw, 38rem"
    />
  );
}

interface ArchitectureDiagramProps {
  media: PublicMediaSource | null;
  projectTitle: string;
}

export function ArchitectureDiagram({ media, projectTitle }: ArchitectureDiagramProps) {
  return (
    <MediaFrame
      fallbackAspectRatio="16 / 9"
      fallbackDescription="No verified architecture diagram is available yet."
      fallbackLabel={`${projectTitle} architecture diagram`}
      kind="architecture"
      media={media}
      objectFit="contain"
      sizes="(max-width: 48rem) 100vw, 75rem"
    />
  );
}

interface ProjectGalleryProps {
  media: readonly PublicMediaSource[];
  projectTitle: string;
}

export function ProjectGallery({ media, projectTitle }: ProjectGalleryProps) {
  if (media.length === 0) {
    return null;
  }

  return (
    <div className="case-study-gallery">
      {media.map((item, index) => (
        <MediaFrame
          fallbackAspectRatio="16 / 10"
          fallbackDescription="This gallery image is unavailable."
          fallbackLabel={`${projectTitle} gallery media`}
          key={`${item.publicPath}-${index}`}
          kind="gallery"
          media={item}
          sizes="(max-width: 48rem) 100vw, 50vw"
        />
      ))}
    </div>
  );
}

interface SupportingMediaProps {
  className?: string;
  media: PublicMediaSource | null;
  title: string;
}

export function QualificationImage({ className, media, title }: SupportingMediaProps) {
  return (
    <MediaFrame
      className={className}
      fallbackAspectRatio="4 / 3"
      fallbackDescription="No privacy-reviewed qualification image is published."
      fallbackLabel={`${title} image unavailable`}
      kind="qualification"
      media={media}
      objectFit="contain"
      sizes="(max-width: 48rem) 100vw, 24rem"
    />
  );
}

export function HobbyImage({ className, media, title }: SupportingMediaProps) {
  return (
    <MediaFrame
      className={className}
      fallbackAspectRatio="16 / 10"
      fallbackDescription="No approved hobby photograph is published."
      fallbackLabel={`${title} image unavailable`}
      kind="hobby"
      media={media}
      sizes="(max-width: 48rem) 100vw, 36rem"
    />
  );
}

interface OpenGraphArtworkProps {
  name: string;
  subtitle: string;
}

export function OpenGraphArtwork({ name, subtitle }: OpenGraphArtworkProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "#050d18",
        color: "#eef5ff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div style={{ color: "#70869f", display: "flex", fontSize: 24, letterSpacing: 2 }}>
        PERSONAL WORKSPACE / VERIFIED PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ color: "#afc6ff", display: "flex", fontSize: 30 }}>TJR</div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>
          {name}
        </div>
        <div style={{ color: "#9cb0c7", display: "flex", fontSize: 30 }}>{subtitle}</div>
      </div>
      <div style={{ background: "#203a57", display: "flex", height: 2, width: "100%" }} />
    </div>
  );
}
