import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { CatalogTemplate } from "@/features/catalog/templates/Catalog";
import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import { createNexonomaApi } from "@/services/api";
import type { CatalogItem } from "@/types/catalog";

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.catalog.page.heading,
    description: dict.catalog.page.description,
  };
}

export default async function CatalogPage({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const api = createNexonomaApi(lang);

  // 1. Daten holen (Typ: any[] oder CatalogItem[], aber wir trauen der API nicht)
  const rawData = await api.getCatalog();

  // 2. Daten bereinigen
  const items: CatalogItem[] = rawData.map(mapToCatalogItem);

  // 3. Rendern
  return <CatalogTemplate items={items} />;
}
