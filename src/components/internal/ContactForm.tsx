"use client";

import { useRef } from "react";
import { sendInquiry } from "./inquiry";

export function ContactForm() {
  const status = useRef<HTMLDivElement>(null);
  return <form className="reference-contact-form" onSubmit={event => {
    event.preventDefault();
    if (status.current) void sendInquiry(event.currentTarget, "contact", status.current);
  }}>
    <h2 className="text-h3">Contact us</h2>
    <label>Your email address <span>*</span><input name="email" type="email" autoComplete="email" className="input-field w-input" required /></label>
    <label>First and last name <span>*</span><input name="name" autoComplete="name" className="input-field w-input" required /></label>
    <label>Subject <span>*</span><input name="subject" className="input-field w-input" required maxLength={256} /></label>
    <label>How can we help you? <span>*</span><textarea name="message" className="input-field w-input" rows={6} required maxLength={10000} /></label>
    <label>Shipment number<input name="shipmentNumber" className="input-field w-input" /></label>
    <label>Attachments<input name="attachment" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" /><small>Up to 10 MB in total.</small></label>
    <label className="reference-consent"><input name="consent" type="checkbox" required /> <span>I agree to the processing of my data in accordance with the <a href="/en/datenschutz">privacy policy</a>. *</span></label>
    <button type="submit">Submit ⟶</button><div ref={status} role="status" aria-live="polite" className="reference-form-status" hidden />
  </form>;
}
