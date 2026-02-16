"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/builder", label: "Builder" },
  { href: "/preview", label: "Preview" },
  { href: "/proof", label: "Proof" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="app-nav no-print">
      <Link href="/" className="app-nav-brand">
        AI Resume Builder
      </Link>
      <div className="app-nav-links">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`app-nav-link ${pathname === href ? "active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
