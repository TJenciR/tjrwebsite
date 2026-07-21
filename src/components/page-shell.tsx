import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  summary: string;
}

export function PageShell({
  children,
  eyebrow,
  title,
  summary,
}: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8" id="main-content">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">{summary}</p>
      </header>
      <div className="mt-8 space-y-8">{children}</div>
    </main>
  );
}

