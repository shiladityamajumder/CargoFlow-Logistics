const beats = [
  { stage: "campus", label: "FORWARDING · TRANSPORT · LOGISTICS", title: "Your forwarding company for transport & logistics.", body: "From the first collection to the final delivery, we keep goods moving with care, clarity and experience." },
  { stage: "warehouse", label: "WAREHOUSING & HANDLING", title: "Room for every next move.", body: "Flexible warehouse space, careful handling and a team that keeps your goods ready for the road ahead." },
  { stage: "network", label: "A CONNECTED NETWORK", title: "The right route, all the way through.", body: "Road, rail and warehousing work together in one dependable network, with clear updates at every handoff." },
  { stage: "hub", label: "BUILT AROUND YOUR BUSINESS", title: "Reliable logistics. Personal service.", body: "Our people bring practical knowledge and a personal approach to every transport challenge." },
  { stage: "freight", label: "ROAD FREIGHT", title: "Every delivery matters.", body: "A dedicated fleet and trusted partners keep regional and international freight moving on schedule." },
  { stage: "handoff", label: "FROM START TO FINISH", title: "Good things are on their way.", body: "Tell us what needs to move. We will make a clear plan and take care of the journey." }
] as const;

export function JourneyNarrative() {
  return (
    <div className="journey-copy">
      {beats.map((beat) => (
        <article key={beat.stage} className={`journey-beat journey-beat--${beat.stage}`} data-beat={beat.stage}>
          <p className="journey-beat__label">{beat.label}</p>
          <h1 className="journey-beat__title">{beat.title}</h1>
          <p className="journey-beat__body">{beat.body}</p>
          {beat.stage === "campus" && (
            <div className="journey-actions">
              <a href="#services" className="button button--primary">Our services <span>↗</span></a>
              <a href="#contact" className="button button--quiet">Get in touch</a>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
