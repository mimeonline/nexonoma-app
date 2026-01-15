import { MacroClusterTemplate } from "@/features/grid/templates/MacroCluster"; // Umbenannt für Konsistenz (s.u.)
import { createGridApi } from "@/services/gridApi";
import { JsonLd, buildBreadcrumbList, buildWebPage } from "@/utils/jsonld";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoUrl, SeoLocale, SEO_BASE_URL } from "../seo";

export default async function GridPage({ params }: PageProps<"/[lang]/grid">) {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const api = createGridApi(lang);
  const macroClusters = await api.getOverview();
  const title = dict?.seo?.grid?.title ?? en.seo.grid.title;
  const description = dict?.seo?.grid?.description ?? en.seo.grid.description;
  const webSite = { url: SEO_BASE_URL, name: "Nexonoma" };
  const pageUrl = buildSeoUrl(lang as SeoLocale, "/grid");
  const pageJsonLd = buildWebPage({
    name: title,
    description,
    url: pageUrl,
    inLanguage: lang,
    webSite,
  });
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: dict?.nav?.start ?? en.nav.start, url: buildSeoUrl(lang as SeoLocale, "") },
    { name: dict?.nav?.structure ?? en.nav.structure, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd id="jsonld-structure" data={pageJsonLd} />
      <JsonLd id="jsonld-structure-breadcrumbs" data={breadcrumbJsonLd} />
      <MacroClusterTemplate macroClusters={macroClusters} />
    </>
  );
}
