import Link from "next/link";

import { getPublicValue } from "@/lib/content-value";
import { siteConfig } from "@/content/site-config";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/documents", label: "Documents" },
] as const;

export function SiteHeader() {
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link className="font-semibold text-slate-950" href="/">
          {name}
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="underline-offset-4 hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

