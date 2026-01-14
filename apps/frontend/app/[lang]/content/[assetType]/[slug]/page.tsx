import { notFound } from "next/navigation";

import { ContentTemplate } from "@/features/content/templates/Content";
import { createContentApi } from "@/services/contentApi";

export default async function ContentAssetPage({ params }: PageProps<"/[lang]/content/[assetType]/[slug]">) {
  const { lang, assetType, slug } = await params;
  const api = createContentApi(lang);

  try {
    const data = await api.getContent(assetType, slug);
    return <ContentTemplate lang={lang} data={data} />;
  } catch (error) {
    console.warn("[content] failed to load", { assetType, slug, error });
    notFound();
  }
}
