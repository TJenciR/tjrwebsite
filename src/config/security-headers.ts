export interface DeploymentHeaderEnvironment {
  readonly VERCEL_ENV?: string;
}

export const baseSecurityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'",
  },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
] as const;

export function getSecurityHeaders(
  environment: DeploymentHeaderEnvironment = { VERCEL_ENV: process.env.VERCEL_ENV },
) {
  return [
    ...baseSecurityHeaders,
    ...(environment.VERCEL_ENV === "production"
      ? []
      : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
  ];
}
