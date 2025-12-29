import type { Metadata } from "next";
import HomeTemplate from "@/features/home/templates/home";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import { buildSeoMetadata, SeoLocale } from "./seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.defaultTitle ?? en.seo.defaultTitle;
  const description = dict?.seo?.defaultDescription ?? en.seo.defaultDescription;

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: "",
    title,
    description,
  });
}

export default function HomePage() {
  return <HomeTemplate />;
}
