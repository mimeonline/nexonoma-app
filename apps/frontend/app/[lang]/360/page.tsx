import { Overview360Template } from "@/features/overview360/templates/Overview360";
import { createOverview360Api } from "@/services/overview360Api";
import { getDictionary, type Locale } from "../dictionaries";
import { I18nProvider } from "@/features/i18n/I18nProvider";

export default async function Overview360Page({ params }: PageProps<"/[lang]/360">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const api = createOverview360Api(lang);
  const data = await api.getOverview();

  return (
    <I18nProvider lang={lang} dict={dict}>
      <Overview360Template data={data} />
    </I18nProvider>
  );
}
