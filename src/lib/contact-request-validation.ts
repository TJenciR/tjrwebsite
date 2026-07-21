import {
  contactRequestLimits,
  opportunityTypes,
  type ContactRequestFieldErrors,
  type ContactRequestInput,
  type OpportunityType,
} from "@/types/contact-request";

const expectedFields = new Set([
  "fullName",
  "professionalEmail",
  "organization",
  "opportunityType",
  "message",
  "roleUrl",
  "consent",
  "website",
]);

export type ContactRequestValidationResult =
  | { readonly ok: true; readonly data: ContactRequestInput; readonly honeypot: boolean }
  | { readonly ok: false; readonly errors: ContactRequestFieldErrors };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizedLine(value: unknown): string | null {
  return typeof value === "string"
    ? value.normalize("NFKC").trim().replaceAll(/\s+/g, " ")
    : null;
}

function normalizedMessage(value: unknown): string | null {
  return typeof value === "string"
    ? value.normalize("NFKC").replaceAll(/\r\n?/g, "\n").trim()
    : null;
}

function isValidEmail(value: string): boolean {
  if (value.length > contactRequestLimits.professionalEmail || /\s/.test(value)) {
    return false;
  }

  const parts = value.split("@");
  if (parts.length !== 2) {
    return false;
  }

  const [local, domain] = parts;
  return Boolean(
    local &&
    domain &&
    local.length <= 64 &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) &&
    domain.length <= 253 &&
    domain.includes(".") &&
    domain.split(".").every((label) =>
      label.length > 0 &&
      label.length <= 63 &&
      !label.startsWith("-") &&
      !label.endsWith("-") &&
      /^[A-Z0-9-]+$/i.test(label)),
  );
}

function normalizedRoleUrl(value: unknown): { value: string | null; valid: boolean } {
  const normalized = normalizedLine(value);
  if (normalized === null || normalized.length === 0) {
    return { value: null, valid: normalized !== null };
  }
  if (normalized.length > contactRequestLimits.roleUrl) {
    return { value: null, valid: false };
  }

  try {
    const url = new URL(normalized);
    const valid = (url.protocol === "https:" || url.protocol === "http:") &&
      url.username.length === 0 &&
      url.password.length === 0 &&
      url.hostname.length > 0;
    return { value: valid ? url.toString() : null, valid };
  } catch {
    return { value: null, valid: false };
  }
}

export function validateContactRequest(input: unknown): ContactRequestValidationResult {
  if (!isRecord(input)) {
    return { ok: false, errors: { form: "Submit the contact form using the supported fields." } };
  }

  const unexpected = Object.keys(input).filter((key) => !expectedFields.has(key));
  if (unexpected.length > 0) {
    return { ok: false, errors: { form: "The request contained unsupported fields." } };
  }

  const errors: ContactRequestFieldErrors = {};
  const fullName = normalizedLine(input.fullName);
  const professionalEmail = normalizedLine(input.professionalEmail)?.toLocaleLowerCase("en") ?? null;
  const organization = normalizedLine(input.organization);
  const opportunityType = normalizedLine(input.opportunityType);
  const message = normalizedMessage(input.message);
  const roleUrl = normalizedRoleUrl(input.roleUrl);
  const website = normalizedLine(input.website);

  if (!fullName || fullName.length < 2) {
    errors.fullName = "Enter your full name.";
  } else if (fullName.length > contactRequestLimits.fullName) {
    errors.fullName = `Use ${contactRequestLimits.fullName} characters or fewer.`;
  }

  if (!professionalEmail || !isValidEmail(professionalEmail)) {
    errors.professionalEmail = "Enter a valid professional email address.";
  }

  if (!organization || organization.length < 2) {
    errors.organization = "Enter your company or organization.";
  } else if (organization.length > contactRequestLimits.organization) {
    errors.organization = `Use ${contactRequestLimits.organization} characters or fewer.`;
  }

  if (!opportunityTypes.includes(opportunityType as OpportunityType)) {
    errors.opportunityType = "Select a supported opportunity type.";
  }

  if (!message || message.length < 20) {
    errors.message = "Provide at least 20 characters about the professional request.";
  } else if (message.length > contactRequestLimits.message) {
    errors.message = `Use ${contactRequestLimits.message} characters or fewer.`;
  }

  if (!roleUrl.valid) {
    errors.roleUrl = "Enter a valid HTTP or HTTPS role-description URL.";
  }

  if (input.consent !== true) {
    errors.consent = "Consent is required before submitting a request.";
  }

  if (website === null) {
    errors.form = "Submit the contact form using the supported fields.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    honeypot: website!.length > 0,
    data: {
      fullName: fullName!,
      professionalEmail: professionalEmail!,
      organization: organization!,
      opportunityType: opportunityType as OpportunityType,
      message: message!,
      roleUrl: roleUrl.value,
    },
  };
}
