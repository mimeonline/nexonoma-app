// src/app/.../page.tsx
import { ContentDetailsTemplate } from "@/features/catalog/templates/ContentDetails";
import { mapToContentDetails } from "@/features/catalog/utils/contentMapper";
import { createNexonomaApi } from "@/services/api";
import type { ContentDetail } from "@/types/catalog";
import { notFound } from "next/navigation";

export default async function ContentDetailPage({ params }: PageProps<"/[lang]/catalog/[contentType]/[contentSlug]">) {
  const { lang } = await params;
  const api = createNexonomaApi(lang);
  const { contentType, contentSlug } = await params;

  let rawItem: Partial<ContentDetail> | null = null;

  try {
    // 1. Fetch
    // Wir casten zu Partial<ContentDetail>, da wir wissen, dass die API
    // JSON zurückgibt, das wir erst mappen müssen.
    rawItem = (await api.getContentBySlug(contentType, contentSlug)) as Partial<ContentDetail>;
  } catch (error) {
    console.error("Error fetching content:", error);
    return notFound();
  }

  if (!rawItem) return notFound();

  // 2. Map (Cleaning Logic)
  // Hier passiert die Magie: Aus API-Daten werden UI-Daten
  const { content, heroQuote } = mapToContentDetails(rawItem);

  // 3. Render
  return <ContentDetailsTemplate contentType={contentType} icon={content.icon} heroQuote={heroQuote} content={content} />;
}
