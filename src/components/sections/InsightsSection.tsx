"use client";

import { useRef, useState } from "react";

const articles = [
  { image: "news-delegation.jpg", title: "Business delegation from Turkmenistan visits Emons in Ditzingen", tag: "Company", text: "An international business delegation visits our team in Ditzingen. Meeting in person brings local experience and international perspectives together, opening a conversation about future transport and logistics connections." },
  { image: "news-2.png", title: "The right container for your next journey", tag: "Knowledge", text: "Choosing a container starts with your cargo. Dimensions, volume, handling and the route all play a part in finding the right fit for an international shipment." },
  { image: "news-3.jpg", title: "Good connections make the difference", tag: "Transport", text: "A connected network brings more possibilities. Collection, consolidation and delivery work together to make every handoff clearer and more dependable." }
];

export function InsightsSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(articles[0]);
  const openArticle = (article: typeof articles[number]) => { setSelected(article); dialog.current?.showModal(); };
  return (
    <section id="insights" className="insights-section page-section" aria-labelledby="insights-title">
      <p className="section-tag section-tag--green">News</p>
      <h2 id="insights-title">Latest news from the Emons world</h2>
      <p className="insights-intro">Discover the people, ideas and developments behind our transport and logistics world. A closer look at what keeps us moving.</p>
      <div className="news-feature"><button className="news-feature-image" type="button" onClick={() => openArticle(articles[0])} aria-label={`Read ${articles[0].title}`}><img src="/reference/news-delegation.jpg" alt="The visiting business delegation with the Emons team" loading="lazy" /></button><div className="news-feature-copy"><p className="news-meta"><span>From the Emons world</span><b>● Company</b></p><h3>{articles[0].title}</h3><button type="button" className="text-link" onClick={() => openArticle(articles[0])}>To the news <span>⟶</span></button></div></div>
      <div className="news-grid">{articles.slice(1).map(article => <button key={article.image} className="news-card" type="button" onClick={() => openArticle(article)}><img src={`/reference/${article.image}`} alt="" loading="lazy" /><span className="news-meta">{article.tag}</span><h3>{article.title}</h3><span className="text-link">To the news ⟶</span></button>)}</div>
      <dialog ref={dialog} className="news-dialog" aria-labelledby="news-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close article">×</button><img src={`/reference/${selected.image}`} alt="" /><div><p className="section-tag section-tag--green">{selected.tag}</p><h2 id="news-dialog-title">{selected.title}</h2><p>{selected.text}</p></div></dialog>
    </section>
  );
}
