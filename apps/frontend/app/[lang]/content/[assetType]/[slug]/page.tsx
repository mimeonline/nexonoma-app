import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentTemplate } from "@/features/content/templates/Content";
import { createContentApi } from "@/services/contentApi";
import de from "../../../dictionaries/de.json";
import en from "../../../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale, truncateDescription } from "../../../seo";

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
    });
  }

  const asset = data.assetBlock;
  const name = asset.name || asset.slug;
  const typeKey = normalizeTypeKey(asset.type);
  const typeLabel = dict?.asset?.labels?.[typeKey] ?? asset.type ?? typeKey;
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
  });
}

export default async function ContentAssetPage({ params }: PageProps<"/[lang]/content/[assetType]/[slug]">) {
  const { lang, assetType, slug } = await params;
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

  return <ContentTemplate lang={lang} data={data} />;
}
