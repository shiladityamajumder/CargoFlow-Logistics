export function ExpertiseSection() {
  return (
    <section id="expertise" className="expertise-section page-section" aria-labelledby="expertise-title">
      <p className="section-tag">About Emons</p>
      <div className="expertise-collage" aria-label="Our people, warehouses and transport network">
        <img className="collage-warehouse" src="/reference/warehouse.webp" alt="Warehouse handling and storage" loading="lazy" />
        <img className="collage-office" src="/reference/office.webp" alt="The team at work" loading="lazy" />
        <img className="collage-people" src="/reference/people.webp" alt="A personal welcome at Emons" loading="lazy" />
        <img className="collage-fleet" src="/reference/fleet.webp" alt="The red Emons fleet" loading="lazy" />
        <img className="collage-train" src="/reference/train.webp" alt="Freight transport by rail" loading="lazy" />
      </div>
      <div className="expertise-content">
        <div className="expertise-heading"><h2 id="expertise-title">Your experts for reliable transport and logistics solutions</h2><div className="inline-actions"><a href="#network" className="pill-link">Learn more about Emons <span>⟶</span></a><a href="#services" className="pill-link">About our services <span>⟶</span></a></div></div>
        <div className="expertise-description"><p>Every shipment starts with an understanding of your business. Our teams combine local knowledge with international connections to find the right solution for your cargo — on the road, by rail, in the air or at sea.</p><p>We make the whole journey work together. From careful warehouse handling to reliable delivery, a clear plan and a personal contact keep your goods moving and your team informed. Whatever your next challenge, we are ready to find the way forward.</p></div>
      </div>
    </section>
  );
}
