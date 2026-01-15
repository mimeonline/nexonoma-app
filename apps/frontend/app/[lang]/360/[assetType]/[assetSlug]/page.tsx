// src/app/.../page.tsx
import { ContentDetailsTemplate } from "@/features/catalog/templates/ContentDetails";
import { mapToContentDetails } from "@/features/catalog/utils/contentMapper";
import { serverLogger } from "@/lib/server-logger";
import { createCatalogApi } from "@/services/catalogApi";
import type { ContentDetail } from "@/types/catalog";
import { notFound } from "next/navigation";

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
  return <ContentDetailsTemplate contentType={assetType} icon={content.icon} heroQuote={heroQuote} content={content} />;
}
