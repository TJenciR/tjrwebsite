import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { contentAuditDate } from "@/lib/content-model";
import { getCanonicalUrl } from "@/lib/seo";

const publicPages = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.8 },
  { path: "/work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/now", changeFrequency: "monthly", priority: 0.7 },
  { path: "/skills", changeFrequency: "yearly", priority: 0.7 },
  { path: "/hobbies", changeFrequency: "yearly", priority: 0.5 },
  { path: "/education", changeFrequency: "yearly", priority: 0.7 },
  { path: "/resume", changeFrequency: "yearly", priority: 0.8 },
  { path: "/contact-access", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/documents", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pageEntries: MetadataRoute.Sitemap = publicPages.map((page) => ({
    changeFrequency: page.changeFrequency,
    lastModified: contentAuditDate,
    priority: page.priority,
    url: getCanonicalUrl(page.path),
  }));
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    changeFrequency: "yearly",
    lastModified: project.verifiedAt ?? contentAuditDate,
    priority: project.featured ? 0.8 : 0.6,
    url: getCanonicalUrl(`/work/${project.slug}`),
  }));

  return [...pageEntries, ...projectEntries];
}
