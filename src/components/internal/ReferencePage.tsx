"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import chrome from "@/content/reference/chrome.json";
import { initReferenceInteractions } from "./interactions";
import { ContactForm } from "./ContactForm";

export function ReferencePage({ html, stylesheet, theme, pathname, children }: { html?: string; stylesheet: string; theme: string; pathname: string; children?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [formTarget, setFormTarget] = useState<Element | null>(null);
  useEffect(() => {
    if (!root.current) return;
    setFormTarget(root.current.querySelector("[data-contact-form]"));
    return initReferenceInteractions(root.current, pathname);
  }, [pathname]);
  return <>
    <link rel="stylesheet" href="/reference/styles/original.css" />
    <link rel="stylesheet" href={`/reference/styles/${stylesheet}.css`} />
    <link rel="stylesheet" href="/reference/styles/interactions.css" />
    <div className="reference-page" data-theme={theme} ref={root}>
      <a className="reference-skip" href="#reference-content">Skip to content</a>
      <div dangerouslySetInnerHTML={{ __html: chrome.navigation }} />
      <div className="page-wrapper" id="reference-content">{html ? <div className="reference-content" dangerouslySetInnerHTML={{ __html: html }} /> : children}<div dangerouslySetInnerHTML={{ __html: chrome.footer }} /></div>
      {formTarget && createPortal(<ContactForm />, formTarget)}
    </div>
  </>;
}
