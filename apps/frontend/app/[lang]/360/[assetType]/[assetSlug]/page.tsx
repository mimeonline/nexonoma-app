// src/app/.../page.tsx
import type { Metadata } from "next";
import { Details360Template } from "@/features/360/templates/360Details";
import { mapToContentDetails } from "@/features/catalog/utils/contentMapper";
import { serverLogger } from "@/lib/server-logger";
import { createCatalogApi } from "@/services/catalogApi";
import type { ContentDetail } from "@/types/catalog";
import { notFound } from "next/navigation";
import de from "../../../dictionaries/de.json";
import en from "../../../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale, truncateDescription } from "../../../seo";

const resolveDict = (lang: string) => (lang === "de" ? de : en);
const normalizeTypeKey = (value?: string) => (value ? value.toLowerCase() : "");
const buildTitle = (pattern: string, name: string, typeLabel: string) =>
  pattern.replace("{name}", name).replace("{type}", typeLabel);
const buildDescription = (base: string, suffix?: string) => (suffix ? `${base} ${suffix}` : base);

const fetch360Content = async (lang: string, assetType: string, assetSlug: string) => {
  const api = createCatalogApi(lang);
  const rawItem = (await api.getContentBySlug(assetType, assetSlug)) as Partial<ContentDetail>;
  if (!rawItem) {
    throw new Error("Missing content detail");
  }
  return mapToContentDetails(rawItem);
};

export async function generateMetadata({ params }: PageProps<"/[lang]/360/[assetType]/[assetSlug]">): Promise<Metadata> {
  const { lang, assetType, assetSlug } = await params;
  const dict = resolveDict(lang);

  try {
    const { content } = await fetch360Content(lang, assetType, assetSlug);
    const name = content.name || content.slug;
    const typeKey = normalizeTypeKey(content.type);
    const typeLabel = dict?.asset?.labels?.[typeKey] ?? content.type ?? typeKey;
    const baseDescription =
      content.shortDescription || content.longDescription || dict?.seo?.detail?.descriptionFallback || en.seo.detail.descriptionFallback;
    const suffix = dict?.seo?.detail?.description360Suffix ?? en.seo.detail.description360Suffix;
    const description = truncateDescription(buildDescription(baseDescription, suffix));
    const titlePattern = dict?.seo?.detail?.titlePattern360 ?? en.seo.detail.titlePattern360;
    const title = buildTitle(titlePattern, name, typeLabel);

    return buildSeoMetadata({
      lang: lang as SeoLocale,
      path: `/360/${assetType}/${assetSlug}`,
      title,
      description,
    });
  } catch (error) {
    serverLogger.error("Error fetching content", { error });
    return buildSeoMetadata({
      lang: lang as SeoLocale,
      path: `/360/${assetType}/${assetSlug}`,
      title: dict?.seo?.defaultTitle ?? en.seo.defaultTitle,
      description: dict?.seo?.defaultDescription ?? en.seo.defaultDescription,
    });
  }
}

export default async function ContentDetailPage({ params }: PageProps<"/[lang]/360/[assetType]/[assetSlug]">) {
  const { lang } = await params;
  const api = createCatalogApi(lang);
  const { assetType, assetSlug } = await params;

  let rawItem: Partial<ContentDetail> | null = null;

  try {
    // 1. Fetch
    // Wir casten zu Partial<ContentDetail>, da wir wissen, dass die API
    // JSON zurückgibt, das wir erst mappen müssen.
    rawItem = (await api.getContentBySlug(assetType, assetSlug)) as Partial<ContentDetail>;
  } catch (error) {
    serverLogger.error("Error fetching content", { error });
    return notFound();
  }

  if (!rawItem) return notFound();

  // 2. Map (Cleaning Logic)
  // Hier passiert die Magie: Aus API-Daten werden UI-Daten
  const { content, heroQuote } = mapToContentDetails(rawItem);

  // 3. Render
  return <Details360Template contentType={assetType} icon={content.icon} heroQuote={heroQuote} content={content} />;
}
