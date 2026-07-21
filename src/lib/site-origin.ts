import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

interface DeploymentEnvironment {
  readonly NODE_ENV?: string;
  readonly PORT?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_URL?: string;
}

export function getCanonicalProductionOrigin(): URL {
  const configuredOrigin = getPublicValue(siteConfig.productionDomain);

  if (!configuredOrigin) {
    throw new Error("A verified canonical production origin is required.");
  }

  return new URL(configuredOrigin);
}

export function getRuntimeOrigin(
  environment: DeploymentEnvironment = process.env,
): URL {
  if (environment.VERCEL_ENV === "preview" && environment.VERCEL_URL) {
    const previewUrl = environment.VERCEL_URL.startsWith("http")
      ? environment.VERCEL_URL
      : `https://${environment.VERCEL_URL}`;

    return new URL(previewUrl);
  }

  if (environment.NODE_ENV !== "production") {
    return new URL(`http://localhost:${environment.PORT ?? "3000"}`);
  }

  return getCanonicalProductionOrigin();
}

export function isIndexableDeployment(
  environment: DeploymentEnvironment = process.env,
): boolean {
  return environment.VERCEL_ENV === "production";
}
