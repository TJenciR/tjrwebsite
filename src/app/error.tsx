"use client";

import Link from "next/link";

import { Button } from "@/components/ui";

interface ErrorPageProps {
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="foundation-main foundation-not-found" id="main-content">
      <p className="ds-eyebrow">Unable to load this page</p>
      <h1>Something went wrong</h1>
      <p>
        The portfolio could not complete this request. No error details or
        submitted information are displayed here.
      </p>
      <div className="foundation-actions">
        <Button onClick={reset}>Try again</Button>
        <Link className="foundation-link" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
