import { Overview360Template } from "@/features/360/templates/Overview360";
import { createOverview360Api } from "@/services/overview360Api";
import { JsonLd, buildBreadcrumbList, buildWebPage } from "@/utils/jsonld";
import { getDictionary, type Locale } from "../dictionaries";
import { I18nProvider } from "@/features/i18n/I18nProvider";
import { buildSeoUrl, SeoLocale, SEO_BASE_URL } from "../seo";

export default async function Overview360Page({ params }: PageProps<"/[lang]/360">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const api = createOverview360Api(lang);
  const data = await api.getOverview();
  const title = dict?.seo?.overview360?.title;
  const description = dict?.seo?.overview360?.description;
  const webSite = { url: SEO_BASE_URL, name: "Nexonoma" };
  const pageUrl = buildSeoUrl(lang as SeoLocale, "/360");
  const pageJsonLd = buildWebPage({
    name: title,
    description,
    url: pageUrl,
    inLanguage: lang,
    webSite,
  });
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: dict?.nav?.start, url: buildSeoUrl(lang as SeoLocale, "") },
    { name: dict?.nav?.overview360, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd id="jsonld-360-index" data={pageJsonLd} />
      <JsonLd id="jsonld-360-index-breadcrumbs" data={breadcrumbJsonLd} />
      <I18nProvider lang={lang} dict={dict}>
        <Overview360Template data={data} />
      </I18nProvider>
    </>
  );
}
