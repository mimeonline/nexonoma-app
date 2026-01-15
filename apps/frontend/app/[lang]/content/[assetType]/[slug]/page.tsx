import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentTemplate } from "@/features/content/templates/Content";
import { createContentApi } from "@/services/contentApi";
import { JsonLd, buildBreadcrumbList, buildDefinedTerm } from "@/utils/jsonld";
import de from "../../../dictionaries/de.json";
import en from "../../../dictionaries/en.json";
import { buildSeoMetadata, buildSeoUrl, SeoLocale, SEO_BASE_URL, truncateDescription } from "../../../seo";

const resolveDict = (lang: string) => (lang === "de" ? de : en);

const normalizeTypeKey = (value?: string) => (value ? value.toLowerCase() : "");

const buildTitle = (pattern: string, name: string, typeLabel: string) =>
  pattern.replace("{name}", name).replace("{type}", typeLabel);

const buildDescription = (base: string, suffix?: string) => (suffix ? `${base} ${suffix}` : base);

const fetchContent = async (lang: string, assetType: string, slug: string) => {
  const api = createContentApi(lang);
  return api.getContent(assetType, slug);
};

export async function generateMetadata({ params }: PageProps<"/[lang]/content/[assetType]/[slug]">): Promise<Metadata> {
  const { lang, assetType, slug } = await params;
  const dict = resolveDict(lang);

  let data: Awaited<ReturnType<typeof fetchContent>> | null = null;
  try {
    data = await fetchContent(lang, assetType, slug);
  } catch {
    return buildSeoMetadata({
      lang: lang as SeoLocale,
      path: `/content/${assetType}/${slug}`,
      title: dict?.seo?.defaultTitle ?? en.seo.defaultTitle,
      description: dict?.seo?.defaultDescription ?? en.seo.defaultDescription,
      openGraphType: "article",
    });
  }

  const asset = data.assetBlock;
  const name = asset.name || asset.slug;
  const typeKey = normalizeTypeKey(asset.type);
  const labels = dict?.asset?.labels;
  const typeLabel = labels && typeKey in labels ? labels[typeKey as keyof typeof labels] : asset.type ?? typeKey;
  const baseDescription = asset.shortDescription || asset.longDescription || dict?.seo?.detail?.descriptionFallback || en.seo.detail.descriptionFallback;
  const has360 = Boolean((asset as { has360?: boolean | null }).has360);
  const suffix = has360 ? dict?.seo?.detail?.description360Suffix ?? en.seo.detail.description360Suffix : undefined;
  const description = truncateDescription(buildDescription(baseDescription, suffix));
  const titlePattern = has360 ? dict?.seo?.detail?.titlePattern360 ?? en.seo.detail.titlePattern360 : dict?.seo?.detail?.titlePattern ?? en.seo.detail.titlePattern;
  const title = buildTitle(titlePattern, name, typeLabel);

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: `/content/${assetType}/${slug}`,
    title,
    description,
    openGraphType: "article",
  });
}

export default async function ContentAssetPage({ params }: PageProps<"/[lang]/content/[assetType]/[slug]">) {
  const { lang, assetType, slug } = await params;
  const dict = resolveDict(lang);
  const api = createContentApi(lang);

  let data: Awaited<ReturnType<typeof api.getContent>> | null = null;

  try {
    data = await api.getContent(assetType, slug);
  } catch (error) {
    console.warn("[content] failed to load", { assetType, slug, error });
  }

  if (!data) {
    notFound();
  }

  const asset = data.assetBlock;
  const name = asset.name || asset.slug;
  const typeKey = normalizeTypeKey(asset.type);
  const labels = dict?.asset?.labels;
  const typeLabel = labels && typeKey in labels ? labels[typeKey as keyof typeof labels] : asset.type ?? typeKey;
  const baseDescription =
    asset.shortDescription || asset.longDescription || dict?.seo?.detail?.descriptionFallback || en.seo.detail.descriptionFallback;
  const has360 = Boolean((asset as { has360?: boolean | null }).has360);
  const suffix = has360 ? dict?.seo?.detail?.description360Suffix ?? en.seo.detail.description360Suffix : undefined;
  const description = truncateDescription(buildDescription(baseDescription, suffix));
  const webSite = { url: SEO_BASE_URL, name: "Nexonoma" };
  const pageUrl = buildSeoUrl(lang as SeoLocale, `/content/${assetType}/${slug}`);
  const termJsonLd = buildDefinedTerm({
    name,
    description,
    url: pageUrl,
    inLanguage: lang,
    webSite,
    about: [{ "@type": "Thing", name: typeLabel }],
  });
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: dict?.nav?.start ?? en.nav.start, url: buildSeoUrl(lang as SeoLocale, "") },
    { name: dict?.nav?.catalog ?? en.nav.catalog, url: buildSeoUrl(lang as SeoLocale, "/catalog") },
    { name, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd id="jsonld-content-detail" data={termJsonLd} />
      <JsonLd id="jsonld-content-detail-breadcrumbs" data={breadcrumbJsonLd} />
      <ContentTemplate lang={lang} data={data} />
    </>
  );
}
