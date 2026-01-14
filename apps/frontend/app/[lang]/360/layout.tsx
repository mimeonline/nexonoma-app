import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale } from "../seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.overview360?.title ?? en.seo.overview360.title;
  const description = dict?.seo?.overview360?.description ?? en.seo.overview360.description;

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: "/360",
    title,
    description,
  });
}

export default function Overview360Layout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">{children}</div>;
}
