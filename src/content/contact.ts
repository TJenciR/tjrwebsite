import { userConfirmedMetadataFor } from "@/lib/content-model";
import type { ContactAccessCopy } from "@/types/content-model";

export const contactAccessCopy: ContactAccessCopy = Object.freeze({
  ...userConfirmedMetadataFor("User-provided v0.10.0 contact-access brief"),
  id: "contact-access",
  state: "request-only",
  heading: "Request professional contact",
  body: "Requests are reviewed manually. Direct contact details remain private and no automatic approval occurs.",
  internalNote: "The request workflow does not disclose the private email or private telephone.",
});
