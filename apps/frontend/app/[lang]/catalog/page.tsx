import { CatalogTemplate } from "@/features/catalog/templates/Catalog";
import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import { createNexonomaApi } from "@/services/api";
import type { CatalogItem } from "@/types/catalog";

// FIXME Das passt so wegen i18n nicht mehr. Muss aus dem dictionaries geholt werden.
// Optional: Metadata für SEO
export const metadata = {
  title: "Katalog | Nexonoma",
  description: "Entdecke Technologien, Methoden und Tools im Nexonoma Katalog.",
};

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
