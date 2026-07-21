import {
  cvVerifiedMetadata,
  hiddenMetadata,
  needsConfirmationMetadata,
  sourcedValue,
  userConfirmedMetadataFor,
} from "@/lib/content-model";
import type {
  Education,
  EducationStatus,
  Qualification,
} from "@/types/content-model";

const educationConflictSource = "docs/audit/content-conflicts.md";

export const education: readonly Education[] = Object.freeze([
  {
    ...needsConfirmationMetadata(
      educationConflictSource,
      "The institution is CV-backed, but its public dates still require confirmation.",
      "cv",
    ),
    id: "bathory-istvan-high-school",
    institution: sourcedValue(
      "Liceul Teoretic “Báthory István”",
      userConfirmedMetadataFor("User-provided v0.6.0 education page brief"),
    ),
    programme: sourcedValue<string>(null, needsConfirmationMetadata(
      educationConflictSource,
      "No programme wording is supplied for the high-school entry.",
    )),
    startDate: sourcedValue(
      "2017-09",
      needsConfirmationMetadata(
        educationConflictSource,
        "September 2017 appears only in the legacy public résumé.",
        "legacy-website",
      ),
    ),
    endDate: sourcedValue(
      "2021-06",
      needsConfirmationMetadata(
        educationConflictSource,
        "June 2021 appears only in the legacy public résumé.",
        "legacy-website",
      ),
    ),
    status: sourcedValue<EducationStatus>("completed", needsConfirmationMetadata(
      educationConflictSource,
      "Completion is implied by the legacy date range but has not been separately confirmed.",
      "legacy-website",
    )),
  },
  {
    ...needsConfirmationMetadata(
      educationConflictSource,
      "University completion, programme wording, faculty, and dates require confirmation.",
      "cv",
    ),
    id: "babes-bolyai-university",
    institution: sourcedValue(
      "Babeș-Bolyai University",
      userConfirmedMetadataFor("User-provided v0.6.0 education page brief"),
    ),
    programme: sourcedValue(
      "Mathematics and Computer Science",
      userConfirmedMetadataFor(
        "User-provided v0.6.0 profile and education page brief; this is background wording, not a degree-completion claim",
      ),
    ),
    startDate: sourcedValue(
      "2021-09",
      needsConfirmationMetadata(
        educationConflictSource,
        "September 2021 appears in the legacy public résumé and requires confirmation.",
        "legacy-website",
      ),
    ),
    endDate: sourcedValue<string>(
      null,
      needsConfirmationMetadata(
        educationConflictSource,
        "No confirmed completion or end date is available.",
      ),
    ),
    status: sourcedValue<EducationStatus>(
      "unknown",
      needsConfirmationMetadata(
        educationConflictSource,
        "Do not translate the old résumé's open-ended date into a current ‘Present’ claim.",
        "cv",
      ),
    ),
  },
]);

const qualificationTitles = [
  ["bacalaureate-diploma", "Bacalaureate diploma"],
  ["linguistic-competence-certificate", "Linguistic competence certificate"],
  ["digital-competence-certificate", "Digital competence certificate"],
  ["professional-competence-certificate", "Professional competence certificate"],
] as const;

export const qualifications: readonly Qualification[] = Object.freeze(
  qualificationTitles.map(([id, title]) => ({
    ...cvVerifiedMetadata,
    id,
    title,
    publicDocumentUrl: sourcedValue<string>(
      null,
      hiddenMetadata(
        "docs/audit/questions-for-richard.md#privacy-and-contact",
        "The qualification fact is source-backed, but public document access requires a privacy decision.",
      ),
    ),
  })),
);
