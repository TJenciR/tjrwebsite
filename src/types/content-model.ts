import type { IsoDate } from "@/types/content";

export const sourceKinds = [
  "user-confirmed",
  "repository-verified",
  "cv",
  "legacy-website",
  "placeholder",
] as const;

export type SourceKind = (typeof sourceKinds)[number];

export const sourcePrecedence: Readonly<Record<SourceKind, number>> = Object.freeze({
  "user-confirmed": 1,
  "repository-verified": 2,
  cv: 3,
  "legacy-website": 4,
  placeholder: 5,
});

export const confidenceLevels = ["confirmed", "high", "medium", "low"] as const;
export type Confidence = (typeof confidenceLevels)[number];

export const publicationStatuses = ["published", "draft", "hidden"] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];

export const verificationStatuses = [
  "verified",
  "needs-confirmation",
  "unverified",
] as const;
export type VerificationStatus = (typeof verificationStatuses)[number];

export interface ContentSource {
  readonly kind: SourceKind;
  readonly reference: string;
}

export interface ContentMetadata {
  readonly source: ContentSource;
  readonly verifiedAt: IsoDate | null;
  readonly confidence: Confidence;
  readonly publicationStatus: PublicationStatus;
  readonly verificationStatus: VerificationStatus;
  readonly internalNote: string | null;
  readonly requiresConfirmation: boolean;
}

export interface SourcedValue<T> extends ContentMetadata {
  readonly value: T | null;
}

export interface Profile extends ContentMetadata {
  readonly id: "primary-profile";
  readonly name: SourcedValue<string>;
  readonly professionalTitle: SourcedValue<string>;
  readonly location: SourcedValue<string>;
  readonly availability: SourcedValue<string>;
}

export interface Biography extends ContentMetadata {
  readonly id: "short-biography" | "long-biography";
  readonly kind: "short" | "long";
  readonly body: string | null;
}

export const educationStatuses = [
  "completed",
  "enrolled",
  "paused",
  "withdrawn",
  "unknown",
] as const;
export type EducationStatus = (typeof educationStatuses)[number];

export interface Education extends ContentMetadata {
  readonly id: string;
  readonly institution: SourcedValue<string>;
  readonly programme: SourcedValue<string>;
  readonly startDate: SourcedValue<string>;
  readonly endDate: SourcedValue<string>;
  readonly status: SourcedValue<EducationStatus>;
}

export interface Qualification extends ContentMetadata {
  readonly id: string;
  readonly title: string;
  readonly publicDocumentUrl: SourcedValue<string>;
}

export const skillProficiencyBands = ["more-proficient", "worked-with"] as const;
export type SkillProficiencyBand = (typeof skillProficiencyBands)[number];

export const skillKinds = [
  "programming-language",
  "scripting-language",
  "assembly-language",
  "database",
  "markup",
  "stylesheet",
  "numerical-computing",
] as const;
export type SkillKind = (typeof skillKinds)[number];

export interface ProgrammingSkill extends ContentMetadata {
  readonly id: string;
  readonly name: string;
  readonly kind: SkillKind;
  readonly proficiency: SkillProficiencyBand;
  readonly evidenceProjectSlugs: readonly string[];
}

export interface Tool extends ContentMetadata {
  readonly id: string;
  readonly name: string;
  readonly evidenceProjectSlugs: readonly string[];
}

export const communicationLevels = [
  "native",
  "full-professional",
  "limited-working",
  "elementary",
] as const;
export type CommunicationLevel = (typeof communicationLevels)[number];

export interface CommunicationLanguage extends ContentMetadata {
  readonly id: string;
  readonly name: string;
  readonly level: CommunicationLevel;
}

export const projectLifecycleStatuses = [
  "finished",
  "work-in-progress",
  "incomplete",
  "unknown",
] as const;
export type ProjectLifecycleStatus = (typeof projectLifecycleStatuses)[number];

export const projectMediaKinds = [
  "cover",
  "gallery",
  "architecture",
  "process",
] as const;
export type ProjectMediaKind = (typeof projectMediaKinds)[number];

export interface ProjectMedia {
  readonly id: string;
  readonly kind: ProjectMediaKind;
  readonly publicPath: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ProjectDates {
  readonly start: string | null;
  readonly end: string | null;
  readonly label: string | null;
}

export interface Project extends ContentMetadata {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly alternateTitles: readonly string[];
  readonly shortDescription: SourcedValue<string>;
  readonly overview: SourcedValue<string>;
  readonly problem: SourcedValue<string>;
  readonly responsibilities: SourcedValue<readonly string[]>;
  readonly process: SourcedValue<string>;
  readonly technicalDecisions: SourcedValue<readonly string[]>;
  readonly solution: SourcedValue<string>;
  readonly outcome: SourcedValue<string>;
  readonly lessonsLearned: SourcedValue<readonly string[]>;
  readonly implementedFunctionality: SourcedValue<readonly string[]>;
  readonly plannedFunctionality: SourcedValue<readonly string[]>;
  readonly status: SourcedValue<ProjectLifecycleStatus>;
  readonly featured: boolean;
  readonly pinned: boolean;
  readonly dates: SourcedValue<ProjectDates>;
  readonly technologies: SourcedValue<readonly string[]>;
  readonly categories: SourcedValue<readonly string[]>;
  readonly coverImage: SourcedValue<ProjectMedia>;
  readonly gallery: SourcedValue<readonly ProjectMedia[]>;
  readonly architectureDiagram: SourcedValue<ProjectMedia>;
  readonly repositoryUrl: SourcedValue<string>;
  readonly liveUrl: SourcedValue<string>;
  readonly legacyUrl: SourcedValue<string>;
  readonly legacyPath: string | null;
  readonly privateProjectNotice: SourcedValue<string>;
}

export interface Hobby extends ContentMetadata {
  readonly id: string;
  readonly name: string;
}

export interface CurrentActivity extends ContentMetadata {
  readonly id: string;
  readonly title: string | null;
  readonly description: string | null;
}

export const socialPlatforms = [
  "facebook",
  "github",
  "instagram",
  "linkedin",
] as const;
export type SocialPlatform = (typeof socialPlatforms)[number];

export interface SocialLink extends ContentMetadata {
  readonly id: string;
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly url: string | null;
}

export const mediaAssetKinds = [
  "portrait",
  "project-screenshot",
  "resume",
] as const;
export type MediaAssetKind = (typeof mediaAssetKinds)[number];

export interface MediaAsset extends ContentMetadata {
  readonly id: string;
  readonly kind: MediaAssetKind;
  readonly alt: string | null;
  readonly publicPath: string | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface ResumeMetadata extends ContentMetadata {
  readonly id: "public-resume";
  readonly label: string;
  readonly publicPath: string | null;
  readonly documentState: "future-sanitized-document";
}

export interface ContactAccessCopy extends ContentMetadata {
  readonly id: "contact-access";
  readonly state: "closed" | "request-only" | "public";
  readonly heading: string;
  readonly body: string;
}

export interface PortfolioContentModel {
  readonly profile: Profile;
  readonly biographies: readonly Biography[];
  readonly education: readonly Education[];
  readonly qualifications: readonly Qualification[];
  readonly programmingSkills: readonly ProgrammingSkill[];
  readonly tools: readonly Tool[];
  readonly communicationLanguages: readonly CommunicationLanguage[];
  readonly projects: readonly Project[];
  readonly hobbies: readonly Hobby[];
  readonly currentActivities: readonly CurrentActivity[];
  readonly socials: readonly SocialLink[];
  readonly mediaAssets: readonly MediaAsset[];
  readonly resume: ResumeMetadata;
  readonly contact: ContactAccessCopy;
}
