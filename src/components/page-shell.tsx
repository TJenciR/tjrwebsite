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
    <main className="foundation-main" id="main-content">
      <header className="foundation-page-header">
        <p className="ds-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{summary}</p>
      </header>
      <div className="foundation-page-content">{children}</div>
    </main>
  );
}

