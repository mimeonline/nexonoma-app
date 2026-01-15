import { CatalogTemplate } from "@/features/catalog/templates/Catalog";
import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import { createCatalogApi } from "@/services/catalogApi";
import type { CatalogItem } from "@/types/catalog";
import { JsonLd, buildBreadcrumbList, buildWebPage } from "@/utils/jsonld";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoUrl, SeoLocale, SEO_BASE_URL } from "../seo";

export default async function CatalogPage({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const api = createCatalogApi(lang);
  const title = dict?.seo?.catalog?.title ?? en.seo.catalog.title;
  const description = dict?.seo?.catalog?.description ?? en.seo.catalog.description;
  const webSite = { url: SEO_BASE_URL, name: "Nexonoma" };
  const pageUrl = buildSeoUrl(lang as SeoLocale, "/catalog");
  const pageJsonLd = buildWebPage({
    name: title,
    description,
    url: pageUrl,
    inLanguage: lang,
    webSite,
  });
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: dict?.nav?.start ?? en.nav.start, url: buildSeoUrl(lang as SeoLocale, "") },
    { name: dict?.nav?.catalog ?? en.nav.catalog, url: pageUrl },
  ]);

  // 1. Daten holen (Typ: any[] oder CatalogItem[], aber wir trauen der API nicht)
  const rawData = await api.getCatalog();

  // 2. Daten bereinigen
  const items: CatalogItem[] = rawData.map(mapToCatalogItem);

  // 3. Rendern
  return (
    <>
      <JsonLd id="jsonld-catalog" data={pageJsonLd} />
      <JsonLd id="jsonld-catalog-breadcrumbs" data={breadcrumbJsonLd} />
      <CatalogTemplate items={items} />
    </>
  );
}
