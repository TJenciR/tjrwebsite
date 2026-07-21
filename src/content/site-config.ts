import { defineContentValue } from "@/lib/content-value";
import type {
  ContactAccessState,
  SiteConfiguration,
} from "@/types/content";

const auditDate = "2026-07-21" as const;

export const siteConfig: SiteConfiguration = Object.freeze({
  name: defineContentValue({
    value: "Tököli Jenő-Richard",
    status: "verified",
    verifiedAt: auditDate,
    source: "User-provided repository brief",
  }),
  draftProfessionalTitle: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-conflicts.md",
  }),
  shortBiography: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-conflicts.md",
  }),
  longBiography: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-conflicts.md",
  }),
  location: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-conflicts.md",
  }),
  currentAvailability: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-conflicts.md",
  }),
  githubUrl: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-inventory.md",
  }),
  linkedinUrl: defineContentValue<string>({
    value: null,
    status: "needs-confirmation",
    verifiedAt: null,
    source: "docs/audit/content-inventory.md",
  }),
  legacyWebsiteUrl: defineContentValue({
    value: "https://tjrichard.netlify.app/",
    status: "verified",
    verifiedAt: auditDate,
    source: "docs/audit/legacy-site-audit.md",
  }),
  productionDomain: defineContentValue<string>({
    value: "https://jenorichardtokoli.com/",
    status: "verified",
    verifiedAt: auditDate,
    source: "User-provided v0.4.0 domain rules",
  }),
  sanitizedResumeUrl: defineContentValue<string>({
    value: null,
    status: "hidden",
    verifiedAt: null,
    source: "Privacy requirement; sanitized replacement not approved",
  }),
  contactAccessState: defineContentValue<ContactAccessState>({
    value: "closed",
    status: "verified",
    verifiedAt: auditDate,
    source: "v0.2.0 migration scope: no contact provider",
  }),
  lastContentVerificationDate: defineContentValue({
    value: auditDate,
    status: "verified",
    verifiedAt: auditDate,
    source: "docs/audit/legacy-site-audit.md",
  }),
});
