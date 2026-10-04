import { ReferencePage } from "@/components/internal/ReferencePage";
import { referencePages } from "@/lib/reference";

export const metadata = { title: "Search | Emons" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query.slice(0, 256).trim() : "";
  const results = query ? Object.entries(referencePages).filter(([, page]) => `${page.heading} ${page.description} ${page.searchText}`.toLowerCase().includes(query.toLowerCase())) : [];
  return <ReferencePage stylesheet="leistungen" theme="dark" pathname="/en/search">
    <main className="main"><section className="section"><div className="container reference-search"><p className="text-small">Home / Search</p><h1 className="text-h1">What are you looking for?</h1><form action="/en/search"><label htmlFor="query">Search our services, locations and news</label><div><input id="query" name="query" type="search" defaultValue={query} className="input-field" required maxLength={256} /><button type="submit">Search ⟶</button></div></form><p role="status">{query ? `${results.length} results for “${query}”` : "Enter a search term to get started."}</p><div className="reference-search-results">{results.map(([href, page]) => <a key={href} href={href}><h2>{page.heading}</h2><p>{page.description}</p><span>Learn more ⟶</span></a>)}</div>{query && results.length === 0 && <p>Try another search term, such as “Road”, “Cologne” or “Logistics”.</p>}</div></section></main>
  </ReferencePage>;
}
