import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ReferencePage } from "@/components/internal/ReferencePage";
import { readReferencePage, referencePages } from "@/lib/reference";

type Props = { params: Promise<{ slug: string[] }> };
const aliases = ["old-frachtanfrage", "frachtanfrage-formular-old"];

export function generateStaticParams() {
  return [...Object.keys(referencePages).map(href => ({ slug: href.replace("/en/", "").split("/") })), ...aliases.map(slug => ({ slug: [slug] }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = referencePages[`/en/${slug.join("/")}`];
  return page ? { title: page.title, description: page.description, openGraph: { title: page.title, description: page.description } } : { title: "Page not found | Emons" };
}

export default async function InternalPage({ params }: Props) {
  const { slug } = await params;
  if (slug.length === 1 && aliases.includes(slug[0])) permanentRedirect("/en/frachtanfrage");
  const href = `/en/${slug.join("/")}`;
  const page = referencePages[href];
  if (!page) notFound();
  return <ReferencePage html={await readReferencePage(page.file)} stylesheet={page.file} theme={page.theme} pathname={href} />;
}
