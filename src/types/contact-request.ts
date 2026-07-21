export const opportunityTypes = [
  "employment-opportunity",
  "contract-project",
  "professional-collaboration",
  "professional-networking",
  "other-professional",
] as const;

export type OpportunityType = (typeof opportunityTypes)[number];

export const opportunityTypeLabels: Readonly<Record<OpportunityType, string>> = Object.freeze({
  "employment-opportunity": "Employment opportunity",
  "contract-project": "Contract project",
  "professional-collaboration": "Professional collaboration",
  "professional-networking": "Professional networking",
  "other-professional": "Other professional inquiry",
});

export const contactRequestLimits = Object.freeze({
  bodyBytes: 12_000,
  fullName: 100,
  professionalEmail: 254,
  organization: 120,
  message: 2_000,
  roleUrl: 500,
});

export interface ContactRequestInput {
  readonly fullName: string;
  readonly professionalEmail: string;
  readonly organization: string;
  readonly opportunityType: OpportunityType;
  readonly message: string;
  readonly roleUrl: string | null;
}

export type ContactRequestField =
  | "fullName"
  | "professionalEmail"
  | "organization"
  | "opportunityType"
  | "message"
  | "roleUrl"
  | "consent"
  | "form";

export type ContactRequestFieldErrors = Partial<Record<ContactRequestField, string>>;

export type ContactRequestState =
  | "initial"
  | "validation-error"
  | "submitting"
  | "submitted"
  | "rate-limited"
  | "provider-unavailable"
  | "server-error";

export type ContactRequestResponse =
  | {
      readonly ok: true;
      readonly state: "submitted";
      readonly message: string;
    }
  | {
      readonly ok: false;
      readonly state: Exclude<ContactRequestState, "initial" | "submitting" | "submitted">;
      readonly message: string;
      readonly fieldErrors?: ContactRequestFieldErrors;
    };

export interface ContactRequestProvider {
  send(request: ContactRequestInput): Promise<void>;
}

export type ContactRateLimitResult = "allowed" | "limited" | "unavailable";

export interface ContactRateLimiter {
  check(request: Request): Promise<ContactRateLimitResult>;
}
