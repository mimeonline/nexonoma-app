import { CatalogTemplate } from "@/features/catalog/templates/Catalog";
import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import { createNexonomaApi } from "@/services/api";
import type { CatalogItem } from "@/types/catalog";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  return {
    title: dict?.seo?.catalog?.title ?? en.seo.catalog.title,
    description: dict?.seo?.catalog?.description ?? en.seo.catalog.description,
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
