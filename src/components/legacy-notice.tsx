import Link from "next/link";

import { StatusNotice } from "@/components/ui";
import { getPublicValue } from "@/lib/content-value";
import { siteConfig } from "@/content/site-config";

interface LegacyNoticeProps {
  path: string;
}

export function LegacyNotice({ path }: LegacyNoticeProps) {
  const legacyWebsiteUrl = getPublicValue(siteConfig.legacyWebsiteUrl);

  if (!legacyWebsiteUrl) {
    return null;
  }

  const legacyUrl = new URL(path, legacyWebsiteUrl).toString();

  return (
    <StatusNotice
      actions={
        <Link className="foundation-link" href={legacyUrl}>
          Open the current legacy page
        </Link>
      }
      title="Legacy site remains authoritative"
      variant="warning"
    >
      This route is a migration placeholder. The existing Netlify page remains
      available until its reviewed replacement is complete.
    </StatusNotice>
  );
}

