import {
  contentAuditDate,
  needsConfirmationMetadata,
  source,
} from "@/lib/content-model";
import type { SocialLink } from "@/types/content-model";

const legacyProfileMetadata = {
  source: source("legacy-website", "docs/audit/content-inventory.md#public-profiles-and-links"),
  verifiedAt: contentAuditDate,
  confidence: "high",
  publicationStatus: "draft",
  verificationStatus: "needs-confirmation",
  internalNote: "The URL was public at audit time; Richard must confirm it belongs on the professional portfolio.",
  requiresConfirmation: true,
} as const;

export const socials: readonly SocialLink[] = Object.freeze([
  {
    ...legacyProfileMetadata,
    id: "facebook",
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/jenci.tokoli",
  },
  {
    ...legacyProfileMetadata,
    id: "instagram",
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/jenci_tokoli",
  },
  {
    ...needsConfirmationMetadata(
      "docs/audit/questions-for-richard.md#profiles-and-public-links",
      "The repository remote confirms one repository location, not the preferred public GitHub profile.",
    ),
    id: "github",
    platform: "github",
    label: "GitHub",
    url: null,
  },
  {
    ...needsConfirmationMetadata(
      "docs/audit/questions-for-richard.md#profiles-and-public-links",
      "No LinkedIn URL has been verified outside Stitch concepts.",
    ),
    id: "linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: null,
  },
]);
