import { communicationLanguages } from "@/content/skills";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";
import { getPublishedEntries } from "@/lib/public-content";
import { getCanonicalUrl, siteName } from "@/lib/seo";

export type StructuredData = Readonly<Record<string, unknown>>;

export function createSiteStructuredData(): StructuredData {
  const location = getPublicValue(siteConfig.location);
  const languages = getPublishedEntries(communicationLanguages).map(({ name }) => name);
  const personId = `${getCanonicalUrl()}#person`;
  const websiteId = `${getCanonicalUrl()}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": personId,
        "@type": "Person",
        ...(location
          ? { homeLocation: { "@type": "Place", name: location } }
          : {}),
        knowsLanguage: languages,
        name: siteName,
        url: getCanonicalUrl(),
      },
      {
        "@id": websiteId,
        "@type": "WebSite",
        creator: { "@id": personId },
        inLanguage: "en",
        name: `${siteName} — personal workspace`,
        url: getCanonicalUrl(),
      },
    ],
  };
}

interface BreadcrumbItem {
  name: string;
  path: `/${string}` | "/";
}

export function createBreadcrumbStructuredData(
  items: readonly BreadcrumbItem[],
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: getCanonicalUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}
