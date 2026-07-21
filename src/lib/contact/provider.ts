import "server-only";

import type {
  ContactRequestInput,
  ContactRequestProvider,
} from "@/types/contact-request";
import { opportunityTypeLabels } from "@/types/contact-request";

const resendEndpoint = "https://api.resend.com/emails";
const providerTimeoutMs = 8_000;

export class ContactProviderUnavailableError extends Error {
  constructor() {
    super("Contact delivery is unavailable.");
    this.name = "ContactProviderUnavailableError";
  }
}

function requestAsPlainText(request: ContactRequestInput): string {
  return [
    "A professional contact request was submitted through the portfolio.",
    "",
    `Name: ${request.fullName}`,
    `Professional email: ${request.professionalEmail}`,
    `Company or organization: ${request.organization}`,
    `Opportunity type: ${opportunityTypeLabels[request.opportunityType]}`,
    `Role description URL: ${request.roleUrl ?? "Not provided"}`,
    "",
    "Message:",
    request.message,
    "",
    "Review this request manually. Submission does not grant contact access.",
  ].join("\n");
}

const developmentProvider: ContactRequestProvider = Object.freeze({
  async send() {
    // Development requests are intentionally discarded without logging content.
  },
});

const resendProvider: ContactRequestProvider = Object.freeze({
  async send(request: ContactRequestInput) {
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
    const sender = process.env.CONTACT_SENDER_EMAIL;

    if (!apiKey || !recipient || !sender) {
      throw new ContactProviderUnavailableError();
    }

    try {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          reply_to: request.professionalEmail,
          subject: `Portfolio contact request: ${opportunityTypeLabels[request.opportunityType]}`,
          text: requestAsPlainText(request),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(providerTimeoutMs),
      });

      if (!response.ok) {
        throw new ContactProviderUnavailableError();
      }
    } catch {
      throw new ContactProviderUnavailableError();
    }
  },
});

export function getContactRequestProvider(): ContactRequestProvider {
  const mode = process.env.CONTACT_DELIVERY_MODE;
  const isVercelProduction = process.env.VERCEL_ENV === "production";

  if (!isVercelProduction && (mode === "development" || !mode)) {
    return developmentProvider;
  }

  if (mode === "resend") {
    return resendProvider;
  }

  return Object.freeze({
    async send() {
      throw new ContactProviderUnavailableError();
    },
  });
}
