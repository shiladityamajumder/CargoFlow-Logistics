"use client";

import { useRef, useState } from "react";

const services = [
  { name: "Road", image: "road", text: "A reliable route for general cargo, part loads and full truckloads. Local collection, a connected transport network and a personal point of contact make every delivery easier." },
  { name: "Rail", image: "rail", text: "Bring road and rail together. Efficient rail connections offer capacity for long distances, while our road network handles collection and the final delivery." },
  { name: "Air", image: "air", text: "When timing matters, air freight puts your cargo on a faster route. We coordinate the collection, handling and onward transport for a complete journey." },
  { name: "Sea", image: "sea", text: "Across oceans and between continents, sea freight gives your business room to grow. Flexible container solutions keep large and small consignments moving." },
  { name: "Customs", image: "customs", text: "Move across borders with a clear plan. Our specialists help coordinate documentation, customs procedures and the details that keep international freight moving." },
  { name: "Logistics", image: "logistics", text: "More than storage. Warehousing, picking, packaging and distribution work together to keep your products ready for their next destination." },
  { name: "Digital solutions", image: "digital", text: "Connected information for connected logistics. Digital shipment visibility helps your team stay informed and make the next decision with confidence." },
  { name: "Other benefits", image: "special", text: "Every business has different requirements. Talk to our team about a transport and logistics solution shaped around your products, routes and schedules." }
];

export function ServicesSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(services[0]);
  const openService = (service: typeof services[number]) => { setSelected(service); dialog.current?.showModal(); };
  return (
    <section id="services" className="services-section page-section" aria-labelledby="services-title">
      <p className="section-tag">Services</p>
      <h2 id="services-title">Our wide<br />range of services</h2>
      <div className="services-grid">
        {services.map(service => <button key={service.image} type="button" className="service-card" onClick={() => openService(service)} aria-label={`Learn more about ${service.name}`}><img src={`/reference/${service.image}.webp`} alt="" loading="lazy" /><span className="service-card-name">{service.name}</span><span className="service-card-link">Learn more ↗</span></button>)}
      </div>
      <dialog ref={dialog} className="service-dialog" aria-labelledby="service-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <button className="dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="Close service details">×</button>
        <img src={`/reference/${selected.image}.webp`} alt="" />
        <div className="service-dialog-copy"><p className="section-tag">Emons services</p><h2 id="service-dialog-title">{selected.name}</h2><p>{selected.text}</p><a href="#contact" className="pill-link" onClick={() => dialog.current?.close()}>Request a freight quote <span>⟶</span></a></div>
      </dialog>
    </section>
  );
}
