export const legacyWebsiteOrigin = "https://tjrichard.netlify.app";

export const legacyPageRoutes = ["/", "/about", "/work", "/documents"] as const;

export const legacyAliases = [
  { source: "/about.html", destination: "/about" },
  { source: "/work.html", destination: "/work" },
  { source: "/documents.html", destination: "/documents" },
] as const;

const legacyDownloadPaths = [
  "/download/pathfinder.zip",
  "/download/optical_character_recognition.zip",
  "/download/spam_filtering.zip",
  "/download/basic_pizza_creator.zip",
  "/download/flower_growth_simulation.zip",
  "/download/space_invaders_v0.1.zip",
] as const;

export const legacyDownloadRedirects = legacyDownloadPaths.map((source) => ({
  source,
  destination: `${legacyWebsiteOrigin}${source}`,
}));

export const legacySensitiveAssets = [
  { path: "/CV.pdf", migrationState: "legacy-only" },
  { path: "/bacdipl.pdf", migrationState: "legacy-only" },
  { path: "/engling.pdf", migrationState: "legacy-only" },
  { path: "/certcomp.pdf", migrationState: "legacy-only" },
  { path: "/ateprof.pdf", migrationState: "legacy-only" },
] as const;

