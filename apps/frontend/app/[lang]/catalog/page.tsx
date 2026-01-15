import { CatalogTemplate } from "@/features/catalog/templates/Catalog";
import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import { createCatalogApi } from "@/services/catalogApi";
import type { CatalogItem } from "@/types/catalog";

export default async function CatalogPage({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const api = createCatalogApi(lang);

  // 1. Daten holen (Typ: any[] oder CatalogItem[], aber wir trauen der API nicht)
  const rawData = await api.getCatalog();

  // 2. Daten bereinigen
  const items: CatalogItem[] = rawData.map(mapToCatalogItem);

  // 3. Rendern
  return <CatalogTemplate items={items} />;
}
