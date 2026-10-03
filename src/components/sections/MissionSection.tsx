export function MissionSection() {
  return (
    <section className="mission-section" aria-labelledby="mission-title">
      <div className="mission-art" aria-hidden="true">
        <span className="mission-cross mission-cross--one">+</span><span className="mission-cross mission-cross--two">+</span><span className="mission-cross mission-cross--three">+</span>
        <img src="/reference/truck.webp" alt="" loading="lazy" />
      </div>
      <div className="mission-content">
        <h2 id="mission-title">Your cargo.<br />Our mission.<br />Welcome to Emons.</h2>
        <div className="mission-description">
          <div className="inline-actions"><a href="#customer-area" className="pill-link">Shipment tracking <span>⟶</span></a><a href="#contact" className="pill-link">Freight request <span>⟶</span></a></div>
          <p>Good logistics brings people, businesses and possibilities together. Across our international network, experienced teams take care of your freight from collection to delivery. Road, rail, air, sea and warehousing — all connected through personal service.</p>
        </div>
      </div>
    </section>
  );
}
