export function FinalCta() {
  return (
    <>
      <section className="final-cta" aria-labelledby="cta-title">
        <img className="cta-art cta-art--left" src="/reference/cta-left.webp" alt="" loading="lazy" />
        <img className="cta-art cta-art--right" src="/reference/cta-right.webp" alt="" loading="lazy" />
        <div className="final-cta-content"><h2 id="cta-title">Because it matters<br />that it matters.</h2><div className="inline-actions"><a href="https://tracking.emons.de/" className="pill-link pill-link--peach">Shipment tracking <span>⟶</span></a><a href="/en/frachtanfrage" className="pill-link pill-link--peach">Freight request <span>⟶</span></a><a href="/en/kontakt" className="pill-link pill-link--peach">Contact <span>⟶</span></a></div></div>
      </section>
      <footer id="contact" className="site-footer">
        <div className="footer-top-grid">
          <a className="footer-brand" href="/" aria-label="Emons home"><img src="/reference/logo.svg" alt="Emons" /></a>
          <div className="footer-contact"><h2>Get in touch</h2><span>Emons headquarters</span><p>Emons Services GmbH<br />Leskan Lofts · East Entrance<br />Waltherstraße 49–51<br />51069 Köln, Germany</p><span>Contact</span><a href="tel:+49221983510">+49 221 98351-0</a><a href="/en/kontakt">Contact our team ⟶</a></div>
          <div id="customer-area" className="footer-hotline"><span>Hotline</span><p>Hotline for consignments</p><a href="tel:+4922198232601">+49 221 98232-601</a><a className="footer-tracking" href="https://tracking.emons.de/inform/WRGenServlet?WrORDER=DRILLDOWNJOB&amp;WrJOB=TrackAndTrace.Sendungsverfolgung" target="_blank" rel="noreferrer">Shipment information ⟶</a></div>
          <div className="footer-social"><h2>Follow us</h2><a href="https://www.facebook.com/emons.logistic/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/emons_logistics/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/company/emons-logistics/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://www.youtube.com/@EmonsLogistics" target="_blank" rel="noreferrer">YouTube</a></div>
        </div>
        <div className="footer-link-grid"><p className="footer-note">We ♥ people.<br />Good logistics starts with a good team.</p><div><h2>About us</h2><a href="/en/portrait">About us</a><a href="/en/standorte">Locations</a><a href="/en/news">News</a><a href="/en/kontakt">Contact</a></div><div><h2>Services</h2><a href="/en/leistungen/strasse">Road</a><a href="/en/leistungen/schiene">Rail</a><a href="/en/leistungen/luft">Air</a><a href="/en/leistungen/see">Sea</a><a href="/en/leistungen/zoll">Customs</a><a href="/en/leistungen/logistik">Logistics</a><a href="/en/leistungen/digital">Digital</a></div><div id="careers"><h2>Career</h2><a href="https://emons-karriere.de/" target="_blank" rel="noreferrer">Stories</a><a href="https://emons-karriere.de/" target="_blank" rel="noreferrer">Jobs</a><a href="/en/kontakt">Contact person</a><a href="https://emons-karriere.de/" target="_blank" rel="noreferrer">Trainees</a><a href="https://emons-karriere.de/" target="_blank" rel="noreferrer">Students</a><a href="https://emons-karriere.de/" target="_blank" rel="noreferrer">Experienced professionals</a></div></div>
        <div className="footer-bottom"><div className="footer-certificates"><img src="/reference/certificate-1.webp" alt="TÜV Rheinland certification" loading="lazy" /><img src="/reference/certificate-2.webp" alt="FuE BSFZ certification" loading="lazy" /><img src="/reference/certificate-3.webp" alt="Why Not certification" loading="lazy" /></div><div className="footer-legal"><a href="/en/impressum">Imprint</a><a href="/en/datenschutz">Data protection</a><a href="#top">Back to top ↑</a><span>© 2026 Emons</span></div></div>
      </footer>
    </>
  );
}
