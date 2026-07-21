export const contentStatuses = [
  "verified",
  "needs-confirmation",
  "hidden",
] as const;

export type ContentStatus = (typeof contentStatuses)[number];

export type IsoDate = `${number}-${number}-${number}`;

export interface ContentValue<T> {
  readonly value: T | null;
  readonly status: ContentStatus;
  readonly verifiedAt: IsoDate | null;
  readonly source: string;
}

export type ContactAccessState = "closed" | "request-only" | "public";

export interface SiteConfiguration {
  readonly name: ContentValue<string>;
  readonly draftProfessionalTitle: ContentValue<string>;
  readonly shortBiography: ContentValue<string>;
  readonly longBiography: ContentValue<string>;
  readonly location: ContentValue<string>;
  readonly currentAvailability: ContentValue<string>;
  readonly githubUrl: ContentValue<string>;
  readonly linkedinUrl: ContentValue<string>;
  readonly legacyWebsiteUrl: ContentValue<string>;
  readonly productionDomain: ContentValue<string>;
  readonly sanitizedResumeUrl: ContentValue<string>;
  readonly contactAccessState: ContentValue<ContactAccessState>;
  readonly lastContentVerificationDate: ContentValue<IsoDate>;
}

