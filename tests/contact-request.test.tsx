import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactRequestForm } from "@/components/contact";
import PrivacyPage from "@/app/privacy/page";
import { handleContactRequest } from "@/lib/contact/handler";
import type {
  ContactRateLimitResult,
  ContactRequestProvider,
  ContactRequestResponse,
} from "@/types/contact-request";

const validPayload = Object.freeze({
  fullName: "  Jane   Recruiter  ",
  professionalEmail: "JANE@EXAMPLE.COM",
  organization: " Example Organization ",
  opportunityType: "employment-opportunity",
  message: "I would like to discuss a relevant professional opportunity.",
  roleUrl: "https://example.com/roles/software",
  consent: true,
  website: "",
});

function requestFor(payload: unknown): Request {
  return new Request("https://jenorichardtokoli.com/api/contact-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function dependencies(options: {
  rateLimit?: ContactRateLimitResult;
  send?: ContactRequestProvider["send"];
} = {}) {
  return {
    provider: { send: options.send ?? vi.fn(async () => undefined) },
    rateLimiter: { check: vi.fn(async () => options.rateLimit ?? "allowed") },
  };
}

async function responseBody(response: Response): Promise<ContactRequestResponse> {
  return await response.json() as ContactRequestResponse;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("contact request route handler", () => {
  it("normalizes and delivers a valid submission without returning contact details", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(requestFor(validPayload), dependencies({ send }));
    const body = await responseBody(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      state: "submitted",
      message: "Request received for manual review. No automatic access has been granted.",
    });
    expect(send).toHaveBeenCalledWith({
      fullName: "Jane Recruiter",
      professionalEmail: "jane@example.com",
      organization: "Example Organization",
      opportunityType: "employment-opportunity",
      message: validPayload.message,
      roleUrl: validPayload.roleUrl,
    });
    expect(JSON.stringify(body)).not.toContain("jane@example.com");
  });

  it("rejects an invalid email", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor({ ...validPayload, professionalEmail: "not-an-email" }),
      dependencies({ send }),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      state: "validation-error",
      fieldErrors: { professionalEmail: "Enter a valid professional email address." },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const response = await handleContactRequest(
      requestFor({ website: "", consent: false }),
      dependencies(),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      state: "validation-error",
      fieldErrors: {
        fullName: expect.any(String),
        professionalEmail: expect.any(String),
        organization: expect.any(String),
        opportunityType: expect.any(String),
        message: expect.any(String),
        consent: expect.any(String),
      },
    });
  });

  it("rejects unexpected fields", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor({ ...validPayload, recipient: "should-not-be-accepted" }),
      dependencies({ send }),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      state: "validation-error",
      fieldErrors: { form: "The request contained unsupported fields." },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("treats a filled honeypot as a successful no-op", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor({ ...validPayload, website: "https://spam.invalid" }),
      dependencies({ send }),
    );

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toMatchObject({ ok: true, state: "submitted" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects oversized input", async () => {
    const response = await handleContactRequest(
      requestFor({ ...validPayload, message: "x".repeat(2_001) }),
      dependencies(),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      state: "validation-error",
      fieldErrors: { message: "Use 2000 characters or fewer." },
    });
  });

  it("rejects a request body above the endpoint cap before delivery", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor({ ...validPayload, padding: "x".repeat(12_500) }),
      dependencies({ send }),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(413);
    expect(body).toMatchObject({
      state: "validation-error",
      fieldErrors: { form: "The submitted request is too large." },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    "ftp://example.com/role",
    "https://user:password@example.com/role",
    "not a URL",
  ])("rejects an invalid role URL: %s", async (roleUrl) => {
    const response = await handleContactRequest(
      requestFor({ ...validPayload, roleUrl }),
      dependencies(),
    );
    const body = await responseBody(response);

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      state: "validation-error",
      fieldErrors: { roleUrl: "Enter a valid HTTP or HTTPS role-description URL." },
    });
  });

  it("returns a rate-limited state before delivery", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor(validPayload),
      dependencies({ rateLimit: "limited", send }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("600");
    expect(await responseBody(response)).toMatchObject({ ok: false, state: "rate-limited" });
    expect(send).not.toHaveBeenCalled();
  });

  it("maps provider failures to a generic unavailable state", async () => {
    const response = await handleContactRequest(
      requestFor(validPayload),
      dependencies({ send: vi.fn(async () => { throw new Error("provider stack and secret"); }) }),
    );
    const body = await responseBody(response);
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(503);
    expect(body).toMatchObject({ ok: false, state: "provider-unavailable" });
    expect(serialized).not.toMatch(/provider stack|secret|jane@example\.com/i);
  });

  it("fails closed when distributed rate limiting is unavailable", async () => {
    const send = vi.fn(async () => undefined);
    const response = await handleContactRequest(
      requestFor(validPayload),
      dependencies({ rateLimit: "unavailable", send }),
    );

    expect(response.status).toBe(503);
    expect(await responseBody(response)).toMatchObject({ ok: false, state: "server-error" });
    expect(send).not.toHaveBeenCalled();
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: "Full name" }), "Jane Recruiter");
  await user.type(screen.getByRole("textbox", { name: "Professional email" }), "jane@example.com");
  await user.type(screen.getByRole("textbox", { name: "Company or organization" }), "Example Org");
  await user.selectOptions(screen.getByRole("combobox", { name: "Opportunity type" }), "employment-opportunity");
  await user.type(
    screen.getByRole("textbox", { name: "Message or reason for contact" }),
    "I would like to discuss a relevant professional opportunity.",
  );
  await user.click(screen.getByRole("checkbox"));
}

describe("contact request form states", () => {
  it("renders the required public fields and privacy copy", () => {
    render(<ContactRequestForm />);

    expect(screen.getByRole("textbox", { name: "Full name" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Professional email" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Company or organization" })).toBeRequired();
    expect(screen.getByRole("combobox", { name: "Opportunity type" })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "Message or reason for contact" })).toBeRequired();
    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByRole("link", { name: "privacy notice" })).toHaveAttribute("href", "/privacy");
  });

  it("shows submitting and submitted states without revealing direct details", async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: Response) => void) | undefined;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolvePromise) => {
      resolveFetch = resolvePromise;
    })));
    render(<ContactRequestForm />);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: "Submit request" }));
    expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled();

    resolveFetch?.(Response.json({
      ok: true,
      state: "submitted",
      message: "Request received for manual review. No automatic access has been granted.",
    } satisfies ContactRequestResponse));

    expect(await screen.findByText("Request submitted")).toBeInTheDocument();
    expect(screen.getByText(/Direct contact details remain private/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/telephone|recipient address/i);
  });

  it.each([
    [429, "rate-limited", "Request limit reached"],
    [503, "provider-unavailable", "Delivery unavailable"],
    [500, "server-error", "Request could not be sent"],
  ] as const)("renders the %s failure response", async (status, state, title) => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({
      ok: false,
      state,
      message: `Public ${state} message`,
    } satisfies ContactRequestResponse, { status })));
    render(<ContactRequestForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(await screen.findByText(title)).toBeInTheDocument();
    expect(screen.getByText(`Public ${state} message`)).toBeInTheDocument();
  });

  it("renders server field validation errors", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({
      ok: false,
      state: "validation-error",
      message: "Review the highlighted fields and submit the request again.",
      fieldErrors: { professionalEmail: "Enter a valid professional email address." },
    } satisfies ContactRequestResponse, { status: 400 })));
    render(<ContactRequestForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(await screen.findByText("Review the form")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid professional email address.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Professional email" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("contact privacy boundaries", () => {
  it("publishes the manual-review and no-automatic-access privacy notice", () => {
    render(<PrivacyPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Privacy notice" })).toBeInTheDocument();
    expect(screen.getByText(/used only to review and respond/)).toBeInTheDocument();
    expect(screen.getByText(/submission does not create an account, grant access, or trigger automatic approval/)).toBeInTheDocument();
    expect(screen.getByText(/does not store requests in a database/)).toBeInTheDocument();
  });

  it("keeps provider names, environment access, and recipient configuration out of client source", () => {
    const clientSource = readFileSync(
      resolve(process.cwd(), "src/components/contact/contact-request-form.tsx"),
      "utf8",
    );

    expect(clientSource).not.toMatch(/process\.env|RESEND|CONTACT_RECIPIENT|CONTACT_SENDER/i);
    expect(clientSource).not.toMatch(/phone|telephone|mailto:/i);
  });

  it("does not log request bodies or full messages in the server path", () => {
    const providerSource = readFileSync(resolve(process.cwd(), "src/lib/contact/provider.ts"), "utf8");
    const handlerSource = readFileSync(resolve(process.cwd(), "src/lib/contact/handler.ts"), "utf8");

    expect(`${providerSource}\n${handlerSource}`).not.toMatch(/console\.|logger\.|JSON\.stringify\(validation\.data\)/);
  });
});
