"use client";

import { useState } from "react";

const links = [
  ["#services", "Services"],
  ["#customer-area", "Customer Area"],
  ["#expertise", "Company"],
  ["#contact", "Contact"],
  ["#careers", "Careers"]
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = [...links, ["#insights", "News"], ["#network", "Our network"]].filter(([, label]) => label.toLowerCase().includes(query.toLowerCase()));
  return (
    <header className="site-header">
      <a href="#top" className="site-brand" aria-label="Emons home"><img src="/reference/logo.svg" alt="Emons" width="78" height="24" /></a>
      <nav className={`site-nav${open ? " site-nav--open" : ""}`} aria-label="Main navigation">
        {links.map(([href, label]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-utilities">
        <button className="header-search" type="button" aria-label="Search this website" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="10" cy="10" r="5.5" /><path d="m14 14 6 6" /></svg></button>
        <span className="header-language" aria-label="Language: English">EN <span>⌄</span></span>
        <a className="header-quote" href="#contact">Freight inquiry <span>⟶</span></a>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span className="menu-label">Menu</span><span className="menu-bars"><i /><i /></span></button>
      </div>
      {searchOpen && <div className="header-search-panel"><label htmlFor="site-search">What are you looking for?</label><input id="site-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search services, company, news…" autoFocus /><div>{results.map(([href, label]) => <a key={href} href={href} onClick={() => setSearchOpen(false)}>{label}<span>↗</span></a>)}{results.length === 0 && <p>No results. Try “services” or “company”.</p>}</div></div>}
    </header>
  );
}
