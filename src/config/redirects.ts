import {
  legacyAliases,
  legacyDownloadRedirects,
  legacyPermanentRedirects,
} from "../content/legacy-routes";

const canonicalOrigin = "https://jenorichardtokoli.com";
const preferredHostname = "www.jenorichardtokoli.com";
const onPreferredAlias = { type: "host" as const, value: preferredHostname };

const directPreferredHostRedirects = [
  ...legacyAliases,
  ...legacyPermanentRedirects,
].map(({ source, destination }) => ({
  destination: `${canonicalOrigin}${destination}`,
  has: [onPreferredAlias],
  permanent: true,
  source,
}));

const directPreferredHostDownloads = legacyDownloadRedirects.map(
  ({ source, destination }) => ({
    destination,
    has: [onPreferredAlias],
    permanent: false,
    source,
  }),
);

export const configuredRedirects = [
  ...directPreferredHostRedirects,
  ...directPreferredHostDownloads,
  {
    destination: `${canonicalOrigin}/:path*`,
    has: [onPreferredAlias],
    permanent: true,
    source: "/:path*",
  },
  ...legacyAliases.map(({ source, destination }) => ({
    destination,
    permanent: true,
    source,
  })),
  ...legacyPermanentRedirects.map(({ source, destination }) => ({
    destination,
    permanent: true,
    source,
  })),
  ...legacyDownloadRedirects.map(({ source, destination }) => ({
    destination,
    permanent: false,
    source,
  })),
];
