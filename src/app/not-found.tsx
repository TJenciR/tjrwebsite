import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16" id="main-content">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-4 leading-7 text-slate-700">
        This foundation preserves known legacy routes and returns a truthful 404
        for unknown paths.
      </p>
      <Link className="mt-6 inline-block underline" href="/">
        Return home
      </Link>
    </main>
  );
}

