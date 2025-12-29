import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale } from "../seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.city?.title ?? en.seo.city.title;
  const description = dict?.seo?.city?.description ?? en.seo.city.description;

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: "/city",
    title,
    description,
    indexable: false,
  });
}

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
