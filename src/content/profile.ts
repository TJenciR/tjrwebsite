import {
  hiddenMetadata,
  needsConfirmationMetadata,
  sourcedValue,
  userConfirmedMetadata,
  userConfirmedMetadataFor,
} from "@/lib/content-model";
import type {
  Biography,
  MediaAsset,
  Profile,
  ResumeMetadata,
} from "@/types/content-model";

const profileConflictSource = "docs/audit/content-conflicts.md";

export const profile: Profile = Object.freeze({
  ...userConfirmedMetadata,
  id: "primary-profile",
  name: sourcedValue("Tököli Jenő-Richard", userConfirmedMetadata),
  professionalTitle: sourcedValue<string>(
    null,
    needsConfirmationMetadata(
      profileConflictSource,
      "Student, graduate, software engineer, and senior titles conflict across sources.",
    ),
  ),
  location: sourcedValue(
    "Cluj-Napoca",
    userConfirmedMetadataFor(
      "User-provided v0.6.0 profile page brief",
    ),
  ),
  availability: sourcedValue<string>(
    null,
    needsConfirmationMetadata(
      profileConflictSource,
      "Current availability and focus statements require a dated user confirmation.",
    ),
  ),
});

export const biographies: readonly Biography[] = Object.freeze([
  {
    ...needsConfirmationMetadata(
      profileConflictSource,
      "No approved short biography exists; generated Stitch narratives are excluded.",
    ),
    id: "short-biography",
    kind: "short",
    body: null,
  },
  {
    ...needsConfirmationMetadata(
      profileConflictSource,
      "No approved long biography exists; employment and outcome claims remain quarantined.",
    ),
    id: "long-biography",
    kind: "long",
    body: null,
  },
]);

export const mediaAssets: readonly MediaAsset[] = Object.freeze([
  {
    ...hiddenMetadata(
      "docs/audit/content-inventory.md#photographs-and-project-imagery",
      "The legacy résumé contains a portrait, but no standalone approved asset or reuse consent exists.",
      "legacy-website",
    ),
    id: "profile-portrait",
    kind: "portrait",
    alt: null,
    publicPath: null,
    width: null,
    height: null,
  },
]);

export const resumeMetadata: ResumeMetadata = Object.freeze({
  ...hiddenMetadata(
    "docs/audit/questions-for-richard.md#privacy-and-contact",
    "The current public résumé exposes private contact data and must not be reused.",
  ),
  id: "public-resume",
  label: "Sanitized résumé",
  publicPath: null,
  documentState: "future-sanitized-document",
});
