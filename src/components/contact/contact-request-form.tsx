"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button, Checkbox, Input, StatusNotice, Textarea } from "@/components/ui";
import {
  contactRequestLimits,
  opportunityTypeLabels,
  opportunityTypes,
  type ContactRequestFieldErrors,
  type ContactRequestResponse,
  type ContactRequestState,
} from "@/types/contact-request";

const fallbackMessages = Object.freeze({
  "rate-limited": "Too many requests were received. Please wait before trying again.",
  "provider-unavailable": "Contact delivery is temporarily unavailable. Please try again later.",
  "server-error": "The request could not be processed. Please try again later.",
});

function responseFallback(status: number): ContactRequestResponse {
  if (status === 429) {
    return { ok: false, state: "rate-limited", message: fallbackMessages["rate-limited"] };
  }
  if (status === 503) {
    return {
      ok: false,
      state: "provider-unavailable",
      message: fallbackMessages["provider-unavailable"],
    };
  }
  return { ok: false, state: "server-error", message: fallbackMessages["server-error"] };
}

function isContactResponse(value: unknown): value is ContactRequestResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const response = value as Record<string, unknown>;
  const validState = response.state === "submitted" ||
    response.state === "validation-error" ||
    response.state === "rate-limited" ||
    response.state === "provider-unavailable" ||
    response.state === "server-error";
  const stateMatchesResult = response.ok === true
    ? response.state === "submitted"
    : response.ok === false && response.state !== "submitted";
  return validState && stateMatchesResult && typeof response.message === "string";
}

export function ContactRequestForm() {
  const [state, setState] = useState<ContactRequestState>("initial");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactRequestFieldErrors>({});
  const isSubmitting = state === "submitting";

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);

    setState("submitting");
    setMessage("Submitting the request securely…");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fields.get("fullName"),
          professionalEmail: fields.get("professionalEmail"),
          organization: fields.get("organization"),
          opportunityType: fields.get("opportunityType"),
          message: fields.get("message"),
          roleUrl: fields.get("roleUrl"),
          consent: fields.get("consent") === "on",
          website: fields.get("website"),
        }),
      });

      let result: ContactRequestResponse;
      try {
        const candidate = await response.json() as unknown;
        result = isContactResponse(candidate) ? candidate : responseFallback(response.status);
      } catch {
        result = responseFallback(response.status);
      }

      setState(result.state);
      setMessage(result.message);
      setFieldErrors(result.ok ? {} : result.fieldErrors ?? {});
      if (result.ok) {
        form.reset();
      }
    } catch {
      setState("server-error");
      setMessage(fallbackMessages["server-error"]);
    }
  }

  if (state === "submitted") {
    return (
      <StatusNotice className="contact-request-result" title="Request submitted" variant="success">
        <p>{message}</p>
        <p>Direct contact details remain private. Richard will decide whether and how to respond.</p>
      </StatusNotice>
    );
  }

  const noticeVariant = state === "validation-error" ? "danger" : "warning";
  const noticeTitle = state === "validation-error"
    ? "Review the form"
    : state === "rate-limited"
      ? "Request limit reached"
      : state === "provider-unavailable"
        ? "Delivery unavailable"
        : "Request could not be sent";

  return (
    <form
      aria-busy={isSubmitting}
      className="contact-request-form"
      noValidate
      onSubmit={submitRequest}
    >
      {state !== "initial" && state !== "submitting" ? (
        <StatusNotice title={noticeTitle} variant={noticeVariant}>
          <p>{message}</p>
          {fieldErrors.form ? <p>{fieldErrors.form}</p> : null}
        </StatusNotice>
      ) : null}

      <div aria-atomic="true" aria-live="polite" className="ds-visually-hidden">
        {state === "submitting" ? message : ""}
      </div>

      <div className="contact-request-form__grid">
        <Input
          autoComplete="name"
          disabled={isSubmitting}
          error={fieldErrors.fullName}
          label="Full name"
          maxLength={contactRequestLimits.fullName}
          name="fullName"
          required
        />
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          error={fieldErrors.professionalEmail}
          inputMode="email"
          label="Professional email"
          maxLength={contactRequestLimits.professionalEmail}
          name="professionalEmail"
          required
          type="email"
        />
        <Input
          autoComplete="organization"
          disabled={isSubmitting}
          error={fieldErrors.organization}
          label="Company or organization"
          maxLength={contactRequestLimits.organization}
          name="organization"
          required
        />
        <div className="ds-field">
          <label className="ds-field__label" htmlFor="contact-opportunity-type">
            Opportunity type
          </label>
          <select
            aria-describedby={fieldErrors.opportunityType ? "contact-opportunity-error" : undefined}
            aria-invalid={fieldErrors.opportunityType ? true : undefined}
            className="contact-request-select"
            defaultValue=""
            disabled={isSubmitting}
            id="contact-opportunity-type"
            name="opportunityType"
            required
          >
            <option disabled value="">Select an opportunity type</option>
            {opportunityTypes.map((type) => (
              <option key={type} value={type}>{opportunityTypeLabels[type]}</option>
            ))}
          </select>
          {fieldErrors.opportunityType ? (
            <span className="ds-field__error" id="contact-opportunity-error">
              <span aria-hidden="true">!</span>{fieldErrors.opportunityType}
            </span>
          ) : null}
        </div>
      </div>

      <Textarea
        description={`Describe the professional context in ${contactRequestLimits.message} characters or fewer.`}
        disabled={isSubmitting}
        error={fieldErrors.message}
        label="Message or reason for contact"
        maxLength={contactRequestLimits.message}
        minLength={20}
        name="message"
        required
        rows={7}
      />

      <Input
        autoComplete="url"
        description="Optional. Use an HTTP or HTTPS link without embedded credentials."
        disabled={isSubmitting}
        error={fieldErrors.roleUrl}
        label="Role description URL"
        maxLength={contactRequestLimits.roleUrl}
        name="roleUrl"
        type="url"
      />

      <div className="contact-request-honeypot">
        <label htmlFor="contact-website">Do not fill this field</label>
        <input
          aria-hidden="true"
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="contact-request-consent">
        <Checkbox
          aria-describedby={fieldErrors.consent ? "contact-consent-error" : "contact-consent-copy"}
          aria-invalid={fieldErrors.consent ? true : undefined}
          disabled={isSubmitting}
          label="I consent to the submitted information being used to review and respond to this request."
          name="consent"
          required
        />
        <p id="contact-consent-copy">
          Requests are reviewed manually. Submission does not reveal private contact details or grant access automatically.
        </p>
        {fieldErrors.consent ? (
          <p className="ds-field__error" id="contact-consent-error">
            <span aria-hidden="true">!</span>{fieldErrors.consent}
          </p>
        ) : null}
      </div>

      <div className="contact-request-form__footer">
        <p>Read the <Link href="/privacy">privacy notice</Link> before submitting.</p>
        <Button disabled={isSubmitting} icon="arrowRight" iconPosition="end" type="submit">
          {isSubmitting ? "Submitting…" : "Submit request"}
        </Button>
      </div>
    </form>
  );
}
