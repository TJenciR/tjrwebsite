import type {
  ContentMetadata,
  ContentSource,
  SourceKind,
  SourcedValue,
} from "@/types/content-model";
import type { ContentStatus, ContentValue } from "@/types/content";

export const contentAuditDate = "2026-07-21" as const;

export function source(kind: SourceKind, reference: string): ContentSource {
  return Object.freeze({ kind, reference });
}

export function metadata(options: ContentMetadata): ContentMetadata {
  return Object.freeze({ ...options });
}

export function sourcedValue<T>(
  value: T | null,
  options: ContentMetadata,
): SourcedValue<T> {
  return Object.freeze({ value, ...options });
}

export function toContentValue<T>(
  value: T | null,
  contentMetadata: ContentMetadata,
): ContentValue<T> {
  const status: ContentStatus = contentMetadata.publicationStatus === "hidden"
    ? "hidden"
    : contentMetadata.publicationStatus === "published" &&
        contentMetadata.verificationStatus === "verified"
      ? "verified"
      : "needs-confirmation";

  return Object.freeze({
    value,
    status,
    verifiedAt: contentMetadata.verifiedAt,
    source: contentMetadata.source.reference,
  });
}

export const userConfirmedMetadata = metadata({
  source: source("user-confirmed", "User-provided v0.5.0 content-model brief"),
  verifiedAt: contentAuditDate,
  confidence: "confirmed",
  publicationStatus: "published",
  verificationStatus: "verified",
  internalNote: null,
  requiresConfirmation: false,
});

export const cvVerifiedMetadata = metadata({
  source: source("cv", "docs/audit/content-inventory.md — sanitized CV inventory"),
  verifiedAt: contentAuditDate,
  confidence: "high",
  publicationStatus: "published",
  verificationStatus: "verified",
  internalNote: null,
  requiresConfirmation: false,
});

export function needsConfirmationMetadata(
  reference: string,
  internalNote: string,
  kind: SourceKind = "placeholder",
): ContentMetadata {
  return metadata({
    source: source(kind, reference),
    verifiedAt: null,
    confidence: "low",
    publicationStatus: "draft",
    verificationStatus: "needs-confirmation",
    internalNote,
    requiresConfirmation: true,
  });
}

export function hiddenMetadata(
  reference: string,
  internalNote: string,
  kind: SourceKind = "placeholder",
): ContentMetadata {
  return metadata({
    source: source(kind, reference),
    verifiedAt: null,
    confidence: "low",
    publicationStatus: "hidden",
    verificationStatus: "needs-confirmation",
    internalNote,
    requiresConfirmation: true,
  });
}
