import { ImageResponse } from "next/og";

import { OpenGraphArtwork } from "@/components/media";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

export const alt = "Tököli Jenő-Richard personal workspace portfolio";
export const contentType = "image/png";
export const size = { height: 630, width: 1200 };

export default function OpenGraphImage() {
  const name = getPublicValue(siteConfig.name) ?? "Tököli Jenő-Richard";

  return new ImageResponse(
    <OpenGraphArtwork name={name} subtitle="Projects, skills, education, and current work" />,
    size,
  );
}
