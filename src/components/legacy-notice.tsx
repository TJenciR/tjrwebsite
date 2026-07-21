import Link from "next/link";

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
    <aside
      aria-labelledby="legacy-notice-title"
      className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
    >
      <h2 className="font-semibold" id="legacy-notice-title">
        Legacy site remains authoritative
      </h2>
      <p className="mt-2 text-sm leading-6">
        This route is a migration placeholder. The existing Netlify page remains
        available until its reviewed replacement is complete.
      </p>
      <Link className="mt-3 inline-block underline" href={legacyUrl}>
        Open the current legacy page
      </Link>
    </aside>
  );
}

