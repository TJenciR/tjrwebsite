# Contact Access deployment

## Vercel configuration

1. Verify a sender domain with Resend.
2. Add `CONTACT_DELIVERY_MODE=resend`, `RESEND_API_KEY`,
   `CONTACT_RECIPIENT_EMAIL`, and `CONTACT_SENDER_EMAIL` as server-only Vercel
   environment variables. Apply real delivery only to the intended production
   environment.
3. Create and publish the Vercel Firewall `@vercel/firewall` rule described in
   `docs/contact-access.md`, using rate-limit ID `contact-request` and 3 requests
   per 10 minutes per IP.
4. Confirm System Environment Variables are available when exercising the SDK in
   preview deployments, following Vercel's preview instructions.
5. Deploy a preview and submit only non-sensitive test content before production.
6. Confirm provider-unavailable and rate-limited states without exposing provider
   configuration in the browser.

Do not configure these values on Netlify and do not redirect the existing
Netlify deployment. The production custom domain remains unchanged until the
approved release branch.

## Local development

Copy `.env.example` to `.env.local` and leave
`CONTACT_DELIVERY_MODE=development`. Local requests are validated and return the
submitted state, but no email is sent and no request content is persisted or
logged.

## Operational checks

- Review requests manually; submission never means approval.
- Never paste direct contact values into Vercel-visible client variables.
- Rotate the Resend key if it is exposed and redeploy after replacement.
- Monitor Vercel Firewall and Resend delivery status without logging message
  bodies in application logs.
- If delivery is unavailable, leave the endpoint fail-closed and fix server
  configuration rather than publishing the private email.

## Emergency disable procedure

Set the Production `CONTACT_DELIVERY_MODE` value to `disabled` and create a new
deployment. The server provider abstraction accepts real delivery only when the
value is exactly `resend`; every other Production value fails closed with the
generic provider-unavailable state. Keep the firewall rule active and verify the
503 response with non-sensitive test data. Re-enable delivery only after the
provider configuration and metadata-only logs have been reviewed.
