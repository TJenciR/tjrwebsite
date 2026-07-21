import type {
  CommunicationLevel,
  ContentMetadata,
  EducationStatus,
  ProjectLifecycleStatus,
  SourcedValue,
} from "@/types/content-model";

export function isPublishedContent(metadata: ContentMetadata): boolean {
  return (
    metadata.publicationStatus === "published" &&
    metadata.verificationStatus === "verified" &&
    metadata.requiresConfirmation === false &&
    metadata.verifiedAt !== null
  );
}

export function getPublishedValue<T>(field: SourcedValue<T>): T | null {
  return isPublishedContent(field) ? field.value : null;
}

export function getPublishedEntries<T extends ContentMetadata>(
  entries: readonly T[],
): readonly T[] {
  return entries.filter(isPublishedContent);
}

const communicationLevelLabels: Readonly<Record<CommunicationLevel, string>> = {
  native: "Native",
  "full-professional": "Full professional",
  "limited-working": "Limited working",
  elementary: "Elementary",
};

export function formatCommunicationLevel(level: CommunicationLevel): string {
  return communicationLevelLabels[level];
}

const projectStatusLabels: Readonly<Record<ProjectLifecycleStatus, string>> = {
  finished: "Finished",
  "work-in-progress": "Work in progress",
  incomplete: "Incomplete",
  unknown: "Status awaiting confirmation",
};

export function formatProjectStatus(status: ProjectLifecycleStatus): string {
  return projectStatusLabels[status];
}

const educationStatusLabels: Readonly<Record<EducationStatus, string>> = {
  completed: "Completed",
  enrolled: "Enrolled",
  paused: "Paused",
  withdrawn: "Withdrawn",
  unknown: "Requires confirmation",
};

export function formatEducationStatus(status: EducationStatus): string {
  return educationStatusLabels[status];
}
