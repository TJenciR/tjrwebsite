import {
  confidenceLevels,
  projectMediaKinds,
  projectLifecycleStatuses,
  publicationStatuses,
  sourceKinds,
  verificationStatuses,
  type PortfolioContentModel,
} from "@/types/content-model";

export type ContentValidationCode =
  | "duplicate-project-id"
  | "duplicate-project-slug"
  | "invalid-external-url"
  | "invalid-project-media"
  | "invalid-status"
  | "missing-project-id"
  | "missing-project-title"
  | "private-contact-data"
  | "unverified-content-published";

export interface ContentValidationIssue {
  readonly code: ContentValidationCode;
  readonly path: string;
  readonly message: string;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasMetadataShape(value: UnknownRecord) {
  return (
    "source" in value &&
    "verifiedAt" in value &&
    "confidence" in value &&
    "publicationStatus" in value &&
    "verificationStatus" in value &&
    "requiresConfirmation" in value
  );
}

function pushInvalidStatus(
  issues: ContentValidationIssue[],
  path: string,
  statusName: string,
) {
  issues.push({
    code: "invalid-status",
    path,
    message: `${statusName} is outside the allowed content model values.`,
  });
}

function validateMetadata(
  value: UnknownRecord,
  path: string,
  issues: ContentValidationIssue[],
) {
  if (!confidenceLevels.includes(value.confidence as never)) {
    pushInvalidStatus(issues, `${path}.confidence`, "Confidence");
  }
  if (!publicationStatuses.includes(value.publicationStatus as never)) {
    pushInvalidStatus(issues, `${path}.publicationStatus`, "Publication status");
  }
  if (!verificationStatuses.includes(value.verificationStatus as never)) {
    pushInvalidStatus(issues, `${path}.verificationStatus`, "Verification status");
  }

  const contentSource = value.source;
  if (
    !isRecord(contentSource) ||
    !sourceKinds.includes(contentSource.kind as never) ||
    typeof contentSource.reference !== "string" ||
    contentSource.reference.trim().length === 0
  ) {
    pushInvalidStatus(issues, `${path}.source`, "Content source");
  }

  const publishedAsVerified =
    value.publicationStatus === "published" && value.verificationStatus !== "verified";
  const inconsistentVerifiedState =
    value.verificationStatus === "verified" &&
    (value.requiresConfirmation !== false ||
      typeof value.verifiedAt !== "string" ||
      (isRecord(contentSource) && contentSource.kind === "placeholder"));

  if (publishedAsVerified || inconsistentVerifiedState) {
    issues.push({
      code: "unverified-content-published",
      path,
      message: "Published or verified content does not satisfy the verification rules.",
    });
  }
}

function validateMetadataRecursively(
  value: unknown,
  path: string,
  issues: ContentValidationIssue[],
) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      validateMetadataRecursively(entry, `${path}[${index}]`, issues),
    );
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  if (hasMetadataShape(value)) {
    validateMetadata(value, path, issues);
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    validateMetadataRecursively(nestedValue, `${path}.${key}`, issues);
  }
}

function validateExternalUrl(
  value: unknown,
  path: string,
  issues: ContentValidationIssue[],
) {
  if (value === null) {
    return;
  }

  if (typeof value !== "string") {
    issues.push({
      code: "invalid-external-url",
      path,
      message: "External URL must be null or a valid HTTPS URL.",
    });
    return;
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.hostname.length === 0) {
      throw new Error("External URLs must use HTTPS.");
    }
  } catch {
    issues.push({
      code: "invalid-external-url",
      path,
      message: "External URL must be null or a valid HTTPS URL.",
    });
  }
}

const forbiddenContactKeys = new Set([
  "email",
  "emailaddress",
  "contactemail",
  "contactphone",
  "mobile",
  "mobilephone",
  "phone",
  "phonenumber",
  "privateemail",
  "privatephone",
  "telephone",
]);
const emailValuePattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const internationalTelephonePattern = /\+[0-9][0-9 ()-]{7,}[0-9]/;

function validatePrivateContactData(
  value: unknown,
  path: string,
  issues: ContentValidationIssue[],
) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      validatePrivateContactData(entry, `${path}[${index}]`, issues),
    );
    return;
  }

  if (typeof value === "string") {
    if (emailValuePattern.test(value) || internationalTelephonePattern.test(value)) {
      issues.push({
        code: "private-contact-data",
        path,
        message: "Client-accessible content contains a direct contact value.",
      });
    }
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase().replaceAll(/[^a-z]/g, "");
    if (forbiddenContactKeys.has(normalizedKey)) {
      issues.push({
        code: "private-contact-data",
        path: `${path}.${key}`,
        message: "Client-accessible content must not define direct contact fields.",
      });
    }
    validatePrivateContactData(nestedValue, `${path}.${key}`, issues);
  }
}

function validateProjectMedia(
  media: unknown,
  path: string,
  issues: ContentValidationIssue[],
) {
  if (media === null) {
    return;
  }

  if (!isRecord(media) ||
    typeof media.id !== "string" || media.id.trim().length === 0 ||
    !projectMediaKinds.includes(media.kind as never) ||
    typeof media.publicPath !== "string" || !media.publicPath.startsWith("/") ||
    typeof media.alt !== "string" || media.alt.trim().length === 0 ||
    typeof media.width !== "number" || media.width <= 0 ||
    typeof media.height !== "number" || media.height <= 0) {
    issues.push({
      code: "invalid-project-media",
      path,
      message: "Project media requires an id, allowed kind, public path, alt text, and positive dimensions.",
    });
  }
}

export function validatePortfolioContent(
  content: PortfolioContentModel | unknown,
): readonly ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  if (!isRecord(content)) {
    return [
      {
        code: "invalid-status",
        path: "content",
        message: "Portfolio content must be an object.",
      },
    ];
  }

  const rawProjects = Array.isArray(content.projects) ? content.projects : [];
  const projectIds = new Set<string>();
  const projectSlugs = new Set<string>();

  rawProjects.forEach((rawProject, index) => {
    const path = `content.projects[${index}]`;
    if (!isRecord(rawProject)) {
      pushInvalidStatus(issues, path, "Project entry");
      return;
    }

    if (typeof rawProject.title !== "string" || rawProject.title.trim().length === 0) {
      issues.push({
        code: "missing-project-title",
        path: `${path}.title`,
        message: "Every project requires a non-empty title.",
      });
    }

    if (typeof rawProject.id !== "string" || rawProject.id.trim().length === 0) {
      issues.push({
        code: "missing-project-id",
        path: `${path}.id`,
        message: "Every project requires a non-empty id.",
      });
    } else {
      if (projectIds.has(rawProject.id)) {
        issues.push({
          code: "duplicate-project-id",
          path: `${path}.id`,
          message: "Project ids must be unique.",
        });
      }
      projectIds.add(rawProject.id);
    }

    if (typeof rawProject.slug === "string") {
      if (projectSlugs.has(rawProject.slug)) {
        issues.push({
          code: "duplicate-project-slug",
          path: `${path}.slug`,
          message: "Project slugs must be unique.",
        });
      }
      projectSlugs.add(rawProject.slug);
    }

    const lifecycleStatus = rawProject.status;
    if (
      isRecord(lifecycleStatus) &&
      !projectLifecycleStatuses.includes(lifecycleStatus.value as never)
    ) {
      pushInvalidStatus(issues, `${path}.status.value`, "Project lifecycle status");
    }

    for (const field of ["repositoryUrl", "liveUrl", "legacyUrl"] as const) {
      const urlField = rawProject[field];
      validateExternalUrl(
        isRecord(urlField) ? urlField.value : urlField,
        `${path}.${field}`,
        issues,
      );
    }

    for (const field of ["coverImage", "architectureDiagram"] as const) {
      const mediaField = rawProject[field];
      const media = isRecord(mediaField) ? mediaField.value : null;
      validateProjectMedia(media, `${path}.${field}`, issues);
    }

    const galleryField = rawProject.gallery;
    const gallery = isRecord(galleryField) ? galleryField.value : null;
    if (gallery !== null) {
      if (!Array.isArray(gallery)) {
        issues.push({
          code: "invalid-project-media",
          path: `${path}.gallery`,
          message: "Project gallery media must be an array.",
        });
      } else {
        gallery.forEach((media, mediaIndex) =>
          validateProjectMedia(media, `${path}.gallery[${mediaIndex}]`, issues),
        );
      }
    }
  });

  const rawSocials = Array.isArray(content.socials) ? content.socials : [];
  rawSocials.forEach((rawSocial, index) => {
    if (isRecord(rawSocial)) {
      validateExternalUrl(rawSocial.url, `content.socials[${index}].url`, issues);
    }
  });

  validateMetadataRecursively(content, "content", issues);
  validatePrivateContactData(content, "content", issues);

  return issues;
}

export function assertValidPortfolioContent(content: PortfolioContentModel): void {
  const issues = validatePortfolioContent(content);
  if (issues.length > 0) {
    const summary = issues.map((issue) => `${issue.code} at ${issue.path}`).join(", ");
    throw new Error(`Invalid portfolio content: ${summary}`);
  }
}
