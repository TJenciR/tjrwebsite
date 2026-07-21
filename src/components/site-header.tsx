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
    <header className="foundation-site-header">
      <div className="foundation-site-header__inner">
        <Link className="foundation-brand" href="/">
          {name}
        </Link>
        <nav aria-label="Primary navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
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

