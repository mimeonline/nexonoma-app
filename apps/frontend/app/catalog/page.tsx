import { Catalog } from "@/features/catalog/templates/Catalog";
import { NexonomaApi } from "@/services/api";
import type { CatalogItem } from "@/types/catalog";
import type { ContentDetail } from "@/types/nexonoma";

function mapContentToCatalogItem(content: ContentDetail): CatalogItem {
  return {
    id: content.id,
    name: content.name,
    slug: content.slug,
    type: content.type,
    shortDescription: content.shortDescription,
    longDescription: content.longDescription,
    tags: content.tags,
    maturityLevel: content.maturityLevel,
    complexityLevel: content.complexityLevel,
    cognitiveLoad: content.cognitiveLoad,
    status: content.status,
    impact: content.impact,
    decisionType: content.decisionType,
    organizationalMaturity: content.organizationalMaturity,
    valueStreamStage: content.valueStreamStage,
    principles: content.principles,
    organizationalLevel: content.organizationalLevel,
  };
}

export default async function CatalogPage() {
  const catalog = await NexonomaApi.getCatalog();
  const items = catalog.map(mapContentToCatalogItem);

  return <Catalog items={items} />;
}
