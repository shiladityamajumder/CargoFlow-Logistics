"use client";

import { useEffect, useRef, useState } from "react";
import { careerUrl, serviceLinks, trackingUrl } from "@/config/navigation";
import searchIndex from "@/config/search-index.json";

const links = [
  ["/en/leistungen", "Services"],
  ["/en/auftragserfassung", "Customer Area"],
  ["/en/portrait", "Company"],
  ["/en/kontakt", "Contact"],
  [careerUrl, "Careers"]
] as const;
const menus: Record<string, { name: string; href: string }[]> = {
  Services: [{ name: "All services", href: "/en/leistungen" }, ...serviceLinks],
  "Customer Area": [{ name: "Shipment tracking", href: trackingUrl }, { name: "Freight request", href: "/en/frachtanfrage" }, { name: "Order entry", href: "/en/auftragserfassung" }, { name: "Cargo international", href: "/en/cargointernational" }, { name: "MyEmons", href: "https://www.myemons.de" }],
  Company: [{ name: "Portrait", href: "/en/portrait" }, { name: "Locations", href: "/en/standorte" }, { name: "News", href: "/en/news" }, { name: "Cybersecurity", href: "/en/cybersicherheit" }, { name: "Munz-LDB", href: "/en/munz-ldb" }]
};

export function Header() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const results = searchIndex.filter(page => `${page.title} ${page.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setMenu(null); setSearchOpen(false); setOpen(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(null); setSearchOpen(false); setOpen(false); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);
  return <header ref={root} className="site-header" onMouseLeave={() => setMenu(null)}>
    <a href="/" className="site-brand" aria-label="Emons home"><img src="/reference/logo.svg" alt="Emons" width="78" height="24" /></a>
    <nav className={`site-nav${open ? " site-nav--open" : ""}`} aria-label="Main navigation">
      {links.map(([href, label]) => <a href={href} key={href} onMouseEnter={() => { if (innerWidth > 900) setMenu(menus[label] ? label : null); }} onFocus={() => { if (innerWidth > 900) setMenu(menus[label] ? label : null); }} onClick={() => setOpen(false)}>{label}</a>)}
      {menu && <div className="home-nav-dropdown" aria-label={`${menu} links`}>{menus[menu].map(link => <a key={link.href} href={link.href}>{link.name}<span>↗</span></a>)}</div>}
    </nav>
    <div className="header-utilities">
      <button className="header-search" type="button" aria-label="Search this website" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); setMenu(null); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="10" cy="10" r="5.5" /><path d="m14 14 6 6" /></svg></button>
      <span className="header-language" aria-label="Language: English">EN <span>⌄</span></span>
      <a className="header-quote" href="/en/frachtanfrage">Freight inquiry <span>⟶</span></a>
      <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span className="menu-label">Menu</span><span className="menu-bars"><i /><i /></span></button>
    </div>
    {searchOpen && <div className="header-search-panel" data-native-scroll><form action="/en/search"><label htmlFor="site-search">What are you looking for?</label><input id="site-search" name="query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search services, company, news…" autoFocus /><div>{results.map(page => <a key={page.href} href={page.href}>{page.title}<span>↗</span></a>)}{results.length === 0 && <p>No results. Try “services” or “company”.</p>}{query && <a href={`/en/search?query=${encodeURIComponent(query)}`}>View all results <span>⟶</span></a>}</div></form></div>}
  </header>;
}
