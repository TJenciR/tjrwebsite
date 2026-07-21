import { contactAccessCopy } from "@/content/contact";
import { biographies, profile, resumeMetadata } from "@/content/profile";
import { socials } from "@/content/socials";
import { defineContentValue } from "@/lib/content-value";
import {
  contentAuditDate,
  toContentValue,
} from "@/lib/content-model";
import type {
  ContactAccessState,
  SiteConfiguration,
} from "@/types/content";

const shortBiography = biographies.find(({ kind }) => kind === "short");
const longBiography = biographies.find(({ kind }) => kind === "long");
const github = socials.find(({ platform }) => platform === "github");
const linkedin = socials.find(({ platform }) => platform === "linkedin");

export const siteConfig: SiteConfiguration = Object.freeze({
  name: toContentValue(profile.name.value, profile.name),
  draftProfessionalTitle: toContentValue(
    profile.professionalTitle.value,
    profile.professionalTitle,
  ),
  shortBiography: toContentValue(shortBiography?.body ?? null, shortBiography ?? profile),
  longBiography: toContentValue(longBiography?.body ?? null, longBiography ?? profile),
  location: toContentValue(profile.location.value, profile.location),
  currentAvailability: toContentValue(profile.availability.value, profile.availability),
  githubUrl: toContentValue(github?.url ?? null, github ?? profile),
  linkedinUrl: toContentValue(linkedin?.url ?? null, linkedin ?? profile),
  legacyWebsiteUrl: defineContentValue({
    value: "https://tjrichard.netlify.app/",
    status: "verified",
    verifiedAt: contentAuditDate,
    source: "docs/audit/legacy-site-audit.md",
  }),
  productionDomain: defineContentValue<string>({
    value: "https://jenorichardtokoli.com/",
    status: "verified",
    verifiedAt: contentAuditDate,
    source: "User-provided v0.4.0 domain rules",
  }),
  sanitizedResumeUrl: toContentValue(resumeMetadata.publicPath, resumeMetadata),
  contactAccessState: toContentValue<ContactAccessState>(
    contactAccessCopy.state,
    contactAccessCopy,
  ),
  lastContentVerificationDate: defineContentValue({
    value: contentAuditDate,
    status: "verified",
    verifiedAt: contentAuditDate,
    source: "v0.5.0 source-aware content model",
  }),
});
