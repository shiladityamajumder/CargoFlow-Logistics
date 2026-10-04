import { serviceLinks } from "@/config/navigation";

export function ServicesSection() {
  return <section id="services" className="services-section page-section" aria-labelledby="services-title">
    <p className="section-tag">Services</p>
    <h2 id="services-title">Our wide<br />range of services</h2>
    <div className="services-grid">{serviceLinks.map(service => <a key={service.image} href={service.href} className="service-card" aria-label={`Learn more about ${service.name}`}><img src={`/reference/${service.image}.webp`} alt="" loading="lazy" /><span className="service-card-name">{service.name}</span><span className="service-card-link">Learn more ↗</span></a>)}</div>
  </section>;
}
