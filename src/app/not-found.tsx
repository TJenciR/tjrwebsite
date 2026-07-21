import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description: "The requested portfolio page could not be found.",
  robots: { follow: false, index: false },
  title: "Page not found",
};

export default function NotFoundPage() {
  return (
    <main className="foundation-main foundation-not-found" id="main-content">
      <p className="ds-eyebrow">404</p>
      <h1>Page not found</h1>
      <p>
        This workspace preserves known legacy routes and returns a truthful 404
        for unknown paths.
      </p>
      <Link className="foundation-link" href="/">
        Return home
      </Link>
    </main>
  );
}

