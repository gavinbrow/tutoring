"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { company } from "@/lib/tutoring";

const links = [
  { href: "/#courses", label: "What we teach" },
  { href: "/#sessions", label: "How a session goes" },
  { href: "/#tutors", label: "Who we are" },
  { href: "/examples", label: "Worked examples" },
  { href: "/#questions", label: "Questions" },
];

export function SiteHeader({ current }: { current?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label={`${company.name} home`}>
          <span className="brand-name">{company.name}</span>
          <span className="brand-sub">Chemistry tutoring</span>
        </Link>
        <nav className="site-nav" id="site-nav" aria-label="Main navigation" data-open={menuOpen}>
          {links.map(link => (
            <Link key={link.href} href={link.href} aria-current={link.href === current ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="button button-small" href="/#request">Request a session</Link>
          <button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  </>;
}
