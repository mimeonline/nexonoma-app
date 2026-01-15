import type { Metadata } from "next";
import HomeTemplate from "@/features/home/templates/home";
import { JsonLd, buildWebPage } from "@/utils/jsonld";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import { buildSeoMetadata, buildSeoUrl, SeoLocale, SEO_BASE_URL } from "./seo";

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

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.defaultTitle ?? en.seo.defaultTitle;
  const description = dict?.seo?.defaultDescription ?? en.seo.defaultDescription;
  const webSite = { url: SEO_BASE_URL, name: "Nexonoma" };
  const pageUrl = buildSeoUrl(lang as SeoLocale, "");
  const pageJsonLd = buildWebPage({
    name: title,
    description,
    url: pageUrl,
    inLanguage: lang,
    webSite,
  });

  return (
    <>
      <JsonLd id="jsonld-home" data={pageJsonLd} />
      <HomeTemplate />
    </>
  );
}
