import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale } from "../seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.preview?.page?.header?.title ?? dict?.preview?.title ?? en.preview.title;
  const description = dict?.preview?.description ?? en.preview.description;

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: "/preview",
    title,
    description,
    indexable: false,
  });
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
