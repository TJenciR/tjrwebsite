import { ImageResponse } from "next/og";

import { OpenGraphArtwork } from "@/components/media";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

const size = { height: 630, width: 1200 };

export function GET() {
  const name = getPublicValue(siteConfig.name) ?? "Tököli Jenő-Richard";

  return new ImageResponse(
    <OpenGraphArtwork name={name} subtitle="Projects, skills, education, and current work" />,
    size,
  );
}
