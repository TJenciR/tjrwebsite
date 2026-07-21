import { validateContactRequest } from "@/lib/contact-request-validation";
import type {
  ContactRateLimiter,
  ContactRequestProvider,
  ContactRequestResponse,
} from "@/types/contact-request";
import { contactRequestLimits } from "@/types/contact-request";

interface ContactRequestDependencies {
  readonly provider: ContactRequestProvider;
  readonly rateLimiter: ContactRateLimiter;
}

const publicMessages = Object.freeze({
  submitted: "Request received for manual review. No automatic access has been granted.",
  validation: "Review the highlighted fields and submit the request again.",
  rateLimited: "Too many requests were received. Please wait before trying again.",
  providerUnavailable: "Contact delivery is temporarily unavailable. Please try again later.",
  serverError: "The request could not be processed. Please try again later.",
});

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
} as const;

function jsonResponse(body: ContactRequestResponse, status: number, extraHeaders?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { ...responseHeaders, ...Object.fromEntries(new Headers(extraHeaders)) },
  });
}

export async function handleContactRequest(
  request: Request,
  dependencies: ContactRequestDependencies,
): Promise<Response> {
  try {
    const rateLimit = await dependencies.rateLimiter.check(request);
    if (rateLimit === "limited") {
      return jsonResponse(
        { ok: false, state: "rate-limited", message: publicMessages.rateLimited },
        429,
        { "Retry-After": "600" },
      );
    }
    if (rateLimit === "unavailable") {
      return jsonResponse(
        { ok: false, state: "server-error", message: publicMessages.serverError },
        503,
      );
    }

    if (!request.headers.get("content-type")?.toLocaleLowerCase("en").startsWith("application/json")) {
      return jsonResponse({
        ok: false,
        state: "validation-error",
        message: publicMessages.validation,
        fieldErrors: { form: "Submit the contact form as JSON." },
      }, 400);
    }

    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > contactRequestLimits.bodyBytes) {
      return jsonResponse({
        ok: false,
        state: "validation-error",
        message: publicMessages.validation,
        fieldErrors: { form: "The submitted request is too large." },
      }, 413);
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > contactRequestLimits.bodyBytes) {
      return jsonResponse({
        ok: false,
        state: "validation-error",
        message: publicMessages.validation,
        fieldErrors: { form: "The submitted request is too large." },
      }, 413);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody) as unknown;
    } catch {
      return jsonResponse({
        ok: false,
        state: "validation-error",
        message: publicMessages.validation,
        fieldErrors: { form: "Submit a valid contact request." },
      }, 400);
    }

    const validation = validateContactRequest(parsed);
    if (!validation.ok) {
      return jsonResponse({
        ok: false,
        state: "validation-error",
        message: publicMessages.validation,
        fieldErrors: validation.errors,
      }, 400);
    }

    if (validation.honeypot) {
      return jsonResponse({ ok: true, state: "submitted", message: publicMessages.submitted }, 200);
    }

    try {
      await dependencies.provider.send(validation.data);
    } catch {
      return jsonResponse({
        ok: false,
        state: "provider-unavailable",
        message: publicMessages.providerUnavailable,
      }, 503);
    }

    return jsonResponse({ ok: true, state: "submitted", message: publicMessages.submitted }, 200);
  } catch {
    return jsonResponse({
      ok: false,
      state: "server-error",
      message: publicMessages.serverError,
    }, 500);
  }
}
