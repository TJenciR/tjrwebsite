import { userConfirmedMetadata } from "@/lib/content-model";
import type { ContactAccessCopy } from "@/types/content-model";

export const contactAccessCopy: ContactAccessCopy = Object.freeze({
  ...userConfirmedMetadata,
  id: "contact-access",
  state: "closed",
  heading: "Contact access is currently closed",
  body: "No direct contact details are published from this portfolio.",
  internalNote: "A future workflow requires separate privacy and provider approval.",
});
