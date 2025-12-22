import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.catalog?.title ?? en.seo.catalog.title;
  const description = dict?.seo?.catalog?.description ?? en.seo.catalog.description;

  return { title, description };
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">{children}</div>;
}
